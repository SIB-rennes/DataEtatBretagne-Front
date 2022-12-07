import { Injectable } from "@angular/core";
import {
  ColumnMetaDataDef,
  ColumnsMetaData,
  Group,
  groupByColumns,
  GroupingColumn,
  RootGroup,
  TableData
} from "./group-utils";

@Injectable()
export class GroupingTableContextService {
  data!: TableData;
  columnsMetaData!: ColumnsMetaData;
  groupingColumns!: GroupingColumn[];
  rootGroup!: RootGroup;
  displayedColumns!: ColumnMetaDataDef[];
  foldedGroups = new Set<Group>();

  setContext(
    data: TableData,
    columnsMetaData: ColumnsMetaData,
    groupingColumns: GroupingColumn[]
  ) {
    this.data = data;
    this.columnsMetaData = columnsMetaData;
    this.groupingColumns = groupingColumns;

    this.rootGroup = this.calculateGroups();
    this.displayedColumns = this.calculateDisplayedColumns();
  }

  private calculateGroups(): RootGroup {
    return groupByColumns(this.data, this.groupingColumns, this.columnsMetaData);
  }

  private calculateDisplayedColumns(): ColumnMetaDataDef[] {
    // Les colonnes affichées
    return this.columnsMetaData.data
      .filter((col) =>
        !this.groupingColumns.some(gc => gc.columnName === col.name)
      );
  }

  isFolded(group: Group): boolean {
    return group ? this.foldedGroups.has(group) : false;
  }

  fold(group: Group) {
    this.foldedGroups.add(group);
  }

  unfold(group: Group) {
    this.foldedGroups.delete(group);
  }

  /**
   * Alterne entre l'état plié et déplié pour le groupe.
   * @return true si plié, false sinon
   */
  toggle(group: Group): boolean {
    if (this.isFolded(group)) {
      this.unfold(group);
      return false;
    } else {
      this.fold(group);
      return true;
    }
  }
}
