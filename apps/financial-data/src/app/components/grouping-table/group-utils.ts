export type ColumnMetaDataDef = {
  name: string;
  label: string;
  // taille de colonne ?
  // alignement (gauche, droite) ?
};

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

export type RowData = Record<string, any>;

export type TableData = RowData[];

export type GroupFnReducerContext = {
  row: any[];
  data: RowData[];
}

export type GroupingColumn = {
  columnName: string;
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

export class RootGroup extends Group {
  constructor() {
    super();
  }
}

export const groupByColumns = (table: TableData, groupings: GroupingColumn[], columnsMetaData: ColumnsMetaData): RootGroup => {
  const root = new RootGroup();
  for (const row of table) {
    let currentGroup = root;
    // tant qu'on n'a pas trouvé le niveau le plus profond où ranger la ligne, on descend
    for (const grouping of groupings) {
      const column = columnsMetaData.getByColumnName(grouping.columnName);
      const groupKey = row[column.name];
      currentGroup = currentGroup.getOrCreateGroup(column, groupKey);
    }
    currentGroup.pushValue(row);
  }
  return root;
};
