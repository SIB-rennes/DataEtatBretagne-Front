import { inject, Injectable } from "@angular/core";
import {
  ColumnMetaDataDef,
  ColumnsMetaData,
  Group,
  groupByColumns,
  GroupingColumn,
  RootGroup,
  TableData
} from "./group-utils";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Injectable()
export class GroupingTableContextService {
  private domSanitizer = inject(DomSanitizer);

  data!: TableData;
  columnsMetaData!: ColumnsMetaData;
  groupingColumns!: GroupingColumn[];
  rootGroup!: RootGroup;
  displayedColumns!: ColumnMetaDataDef[];
  foldedGroups = new Set<Group>();
  columnCssStyle: SafeHtml | null = null;

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
    this.columnCssStyle = this.calculateColumnStyle();
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

  /**
   * Retourne les définitions de règles CSS pour chacune des colonnes.
   */
  private calculateColumnStyle(): SafeHtml | null {
    const colStyles: any[] = [];
    this.displayedColumns.forEach((col, i) => {
      if (!col.columnStyle) {
        return;
      }
      colStyles.push('.col-', i, ' {\n');
      for (const [k,v] of Object.entries(col.columnStyle)) {
        colStyles.push(k, ':', v, ';\n');
      }
      colStyles.push('}\n');
    });
    return colStyles.length
      ? this.domSanitizer.bypassSecurityTrustHtml(`<style>${colStyles.join('')}</style>`)
      : null;
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
