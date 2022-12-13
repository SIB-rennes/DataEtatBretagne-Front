import { Component, inject } from '@angular/core';
import {
  AggregatorFns,
  ColumnsMetaData,
  GroupingColumn,
  TableData,
} from '../../components/grouping-table/group-utils';
import { DatePipe } from '@angular/common';
import {
  GroupingConfigDialogComponent
} from "../../components/grouping-config-dialog/grouping-config-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'financial-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private datePipe = inject(DatePipe);
  private dialog = inject(MatDialog);

  columnsMetaData: ColumnsMetaData;

  tableData?: TableData;

  groupingColumns: GroupingColumn[] = [
    { columnName: 'nom_programme' },
    { columnName: 'type_etablissement' },
    { columnName: '*commune' },
  ];

  searchInProgress = false;

  constructor() {
    const moneyFormat = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
    const dateFormat = (dateStr: string) =>
      dateStr ? this.datePipe.transform(dateStr, 'shortDate') : '';

    this.columnsMetaData = new ColumnsMetaData([
      { name: 'nom_beneficiaire', label: 'Bénéficiaire' },
      { name: 'Theme', label: 'Thème' },
      { name: 'nom_programme', label: 'Programme' },
      {
        name: '*commune',
        label: 'Commune',
        renderFn: (row, _col) => row['commune']?.['LabelCommune'],
      },
      { name: 'code_siret', label: 'Siret' },
      {
        name: 'type_etablissement',
        label: `Type d'établissement`,
        renderFn: (row, col) =>
          row[col.name] !== null ? row[col.name] : 'Non renseigné',
      },
      {
        name: 'DateModificationEj',
        label: "Date d'actualisation",
        renderFn: (row, col) =>
          row[col.name] ? dateFormat(row[col.name]) : row[col.name],
      },
      {
        name: 'Montant',
        label: 'Montant',
        renderFn: (row, col) =>
          row[col.name] ? moneyFormat.format(row[col.name]) : row[col.name],
        aggregateReducer: AggregatorFns.sum,
        aggregateRenderFn: (aggregateValue) =>
          aggregateValue ? moneyFormat.format(aggregateValue) : aggregateValue,
      },
    ]);
  }

  openGroupConfigDialog() {
    let dialogRef = this.dialog.open(GroupingConfigDialogComponent, {
      data: {
        columns: this.columnsMetaData.data,
        groupingColumns: this.groupingColumns
      },
      width: '40rem',
      autoFocus: 'input',
    });
    dialogRef.afterClosed().subscribe((updatedGroupingColumns: GroupingColumn[]) => {
      if (updatedGroupingColumns) {
        this.groupingColumns = updatedGroupingColumns;
      }
    });

  }
}
