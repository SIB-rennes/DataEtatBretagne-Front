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

  // taille de colonne ?
  // alignement (gauche, droite) ?
};

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

export type GroupFnReducerContext = {
  row: RowData;
  data: TableData;
}

export type GroupingColumn = {
  columnName: string;

  /**
   * Fonction d'aggrégation permettant de calculer la valeur à afficher en en-tête de colonne d'un groupe.
   * @param currentValue
   * @param context
   * @param accumulator
   */
  aggregateReducer?: <T>(currentValue: any, context: GroupFnReducerContext, accumulator?: T) => T;
}

/**
 * Un groupe, qui peut contenir soit des groupes enfants, soit des lignes de données.
 */
export class Group {
  private groupsMap?: Map<any, Group>;
  rows?: any[];

  get groups() {
    if (!this.groupsMap) {
      return [];
    }
    return [...this.groupsMap.values()]
  }

  constructor(public readonly column?: ColumnMetaDataDef, public readonly columnValue?: any) {
  }

  getOrCreateGroup(column: ColumnMetaDataDef, groupColumnValue: any): Group {
    if (!this.groupsMap) {
      this.groupsMap = new Map();
    }
    let group = this.groupsMap.get(groupColumnValue);
    if (!group) {
      group = new Group(column, groupColumnValue);
      this.groupsMap.set(groupColumnValue, group);
    }
    return group;
  }

  pushValue(row: RowData) {
    if (!this.rows) {
      this.rows = [];
    }
    this.rows.push(row);
  }
}

/**
 * Groupe racine.
 */
export class RootGroup extends Group {
  constructor() {
    super();
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
  const root = new RootGroup();
  for (const row of table) {
    let currentGroup = root;
    // tant qu'on n'a pas trouvé le niveau le plus profond où ranger la ligne, on descend
    for (const grouping of groupings) {
      const column = columnsMetaData.getByColumnName(grouping.columnName);
      const groupKey = column.renderFn ? column.renderFn(row, column) : row[column.name];
      currentGroup = currentGroup.getOrCreateGroup(column, groupKey);
    }
    currentGroup.pushValue(row);
  }
  return root;
};
