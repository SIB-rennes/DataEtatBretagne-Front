export type AggregateReducerContext = {
  row: RowData;
  group: Group;
}

type AggregateReducer<T> = (currentValue: any, context: AggregateReducerContext, accumulator?: T) => T;

/**
 * Méta-données d'une colonne. Contient les informations pour l'affichage de la colonne.
 */
export type ColumnMetaDataDef = {
  /** Nom technique de la colonne. */
  name: string;

  /** Libellé de la colonne, affiché dans le tableau. */
  label: string;

  /**
   * Fonction de rendu permettant d'adapter la valeur de la cellule avant affichage.
   * Peut permettre d'afficher une valeur différente de celle de la cellule, ou de gérer les sous-objets.
   * @param row ligne de données
   * @param col colonne de la cellule
   */
  renderFn?: (row: RowData, col: ColumnMetaDataDef) => string | undefined;

  /**
   * Fonction d'aggrégation permettant de calculer la valeur à afficher en en-tête de colonne d'un groupe.
   * @param currentValue
   * @param context
   * @param accumulator
   */
  aggregateReducer?: AggregateReducer<any>;

  /**
   * Fonction de rendu permettant d'adapter la valeur calculée sur le header de groupe avant affichage.
   * @param aggregateValue valeur agrégée
   * @param row ligne de données
   * @param col colonne
   */
  aggregateRenderFn?: (aggregateValue: any, group: Group, col: ColumnMetaDataDef) => string | undefined;

  /**
   * Styles css à appliquer sur les cellules de la colonne.
   * Permet par exemple de spécifier des contraintes de dimensionnement (`min-width`, `max-width`) ou d'alignement.
   *
   * Attention : la largeur ne doit en aucun cas dépendre du contenu des cellules. C'est important pour que chaque ligne
   * d'une même colonne ait la même largeur.
   */
  columnStyle?: Record<string, string>;
};

export class AggregatorFns {
  static sum(currentValue: any, context: AggregateReducerContext, accumulator?: number): number | undefined {
    if (!currentValue) {
      return accumulator;
    }
    return (accumulator || 0) + currentValue;
  }

  static average(currentValue: number | undefined, context: AggregateReducerContext, accumulator?: number): number {
    let nbRows = context.group.rows?.length || 0;
    if (nbRows <= 1) {
      return currentValue || 0;
    }
    return ((accumulator || 0) * (nbRows - 1) + (currentValue || 0)) / nbRows;
  }

  static count(currentValue: any, context: AggregateReducerContext, accumulator?: number): number {
    return (accumulator || 0) + 1;
  }
}

/**
 * Méta-données pour l'ensemble des colonnes.
 */
export class ColumnsMetaData {
  private metaDataMap = new Map<string, ColumnMetaDataDef>();

  constructor(public readonly data: ColumnMetaDataDef[]) {
    for (const def of data) {
      this.metaDataMap.set(def.name, def);
    }
  }

  getByColumnName(name: string): ColumnMetaDataDef {
    let metaDataDef = this.metaDataMap.get(name);
    if (!metaDataDef) {
      throw new Error(`Pas de meta-données pour la colonne "${name}"`)
    }
    return metaDataDef;
  }
}

export type ColumnSizes = number[];

/**
 * Ligne de donées.
 */
export type RowData = Record<string, any>;

/**
 * Données du tableau (ensemble de lignes).
 */
export type TableData = RowData[];

export type GroupingColumn = {
  columnName: string;
}

/**
 * Un groupe, qui peut contenir soit des groupes enfants, soit des lignes de données.
 */
export class Group {
  private groupsMap?: Map<any, Group>;
  aggregates?: Record<string, any>;
  rows?: RowData[];

  get groups() {
    if (!this.groupsMap) {
      return [];
    }
    return [...this.groupsMap.values()];
  }

  constructor(
    public readonly column?: ColumnMetaDataDef,
    public readonly columnValue?: any,
    public readonly parent?: Group,
    private columnsAggregateFns?: Record<string, AggregateReducer<any>>,
  ) {
  }

  getOrCreateGroup(column: ColumnMetaDataDef, groupColumnValue: any): Group {
    if (!this.groupsMap) {
      this.groupsMap = new Map();
    }
    let group = this.groupsMap.get(groupColumnValue);
    if (!group) {
      group = new Group(column, groupColumnValue, this, this.columnsAggregateFns);
      this.groupsMap.set(groupColumnValue, group);
    }
    return group;
  }

  addRow(row: RowData) {
    if (!this.rows) {
      this.rows = [];
    }
    this.rows.push(row);
    if (this.columnsAggregateFns) {
      this.aggregateColumnValues(row);
    }
  }

  aggregateColumnValues(row: RowData) {
    if (!this.aggregates) {
      this.aggregates = {};
    }
    // On met à jour les aggrégats pour chacune des colonnes.
    for (const columnName in this.columnsAggregateFns) {
      const aggregateFn = this.columnsAggregateFns[columnName];
      this.aggregates[columnName] = aggregateFn(row[columnName], {row, group: this}, this.aggregates[columnName]);
    }
    // On les met à jour pour les groupes parents également.
    this.parent?.aggregateColumnValues(row);
  }
}

/**
 * Groupe racine.
 */
export class RootGroup extends Group {
  constructor(aggregateReducers: Record<string, AggregateReducer<any>>) {
    super(undefined, undefined, undefined, aggregateReducers);
  }
}

/**
 * Fonction de regroupement des données.
 *
 * @param table
 * @param groupings
 * @param columnsMetaData
 */
export const groupByColumns = (table: TableData, groupings: GroupingColumn[], columnsMetaData: ColumnsMetaData): RootGroup => {
  // On construit l'ensemble des fonctions d'aggrégation.
  const aggregateFns: Record<string, AggregateReducer<any>> = {};
  // ... Cet ensemble reprend les fonctions d'aggrégation définies sur chacune des colonnes
  for (const colMetaData of columnsMetaData.data) {
    if (colMetaData.aggregateReducer) {
      aggregateFns[colMetaData.name] = colMetaData.aggregateReducer;
    }
  }
  // ... et pour les colonnes de groupe, on effectue un décompte des entrées.
  for (const grouping of groupings) {
    aggregateFns[grouping.columnName] = AggregatorFns.count;
  }

  const root = new RootGroup(aggregateFns);
  for (const row of table) {
    let currentGroup = root;
    // tant qu'on n'a pas trouvé le niveau le plus profond où ranger la ligne, on descend
    for (const grouping of groupings) {
      const column = columnsMetaData.getByColumnName(grouping.columnName);
      const groupKey = column.renderFn ? column.renderFn(row, column) : row[column.name];
      currentGroup = currentGroup.getOrCreateGroup(column, groupKey);
    }
    currentGroup.addRow(row);
  }
  return root;
};
