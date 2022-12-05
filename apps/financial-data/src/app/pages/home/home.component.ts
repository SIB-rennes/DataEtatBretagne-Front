import { Component } from '@angular/core';
import tableData from './example_chorus.json';
import {
  ColumnMetaDataDef,
  ColumnsMetaData,
  GroupingColumn,
  TableData
} from "../../components/grouping-table/group-utils";

@Component({
  selector: 'financial-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  columnsMetaData = this.colDefFromData(tableData);

  private colDefFromData(data: TableData): ColumnsMetaData {
    const keys = Object.keys(data[0]);
    const columnDefinitions: ColumnMetaDataDef[] = keys.map(key => ({name: key, label: key}));
    return new ColumnsMetaData(columnDefinitions);
  }

  tableData: TableData = tableData;

  groupingColumns: GroupingColumn[] = [{
    columnName: 'Theme'
  }, {
    columnName: 'nom_programme'
  }];
}
