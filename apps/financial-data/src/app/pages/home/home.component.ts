import { Component, inject } from '@angular/core';
import { AggregatorFns, ColumnsMetaData, GroupingColumn, TableData } from "../../components/grouping-table/group-utils";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'financial-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  private datePipe = inject(DatePipe);

  columnsMetaData: ColumnsMetaData;

  tableData?: TableData;

  groupingColumns: GroupingColumn[] = [
    {columnName: 'Theme'},
    {columnName: 'nom_programme'},
    {columnName: 'label ref programmation'},
  ];

  searchInProgress = false;

  constructor() {
    const moneyFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
    const dateFormat = (dateStr: string) => dateStr ? this.datePipe.transform(dateStr, 'shortDate') : '';

    this.columnsMetaData = new ColumnsMetaData([
      {name: 'Theme', label: 'Thème'},
      {name: 'nom_programme', label: 'Programme'},
      {name: 'label ref programmation', label: 'Réf. programmation'},
      //{name: 'code_programme', label: 'code_programme'},
      {name: 'Commune', label: 'Commune', renderFn: (row, col) => row[col.name]?.['LabelCrte'] },
      //{name: 'code_commune', label: 'code_commune'},
      {name: 'nom_beneficiaire', label: 'Bénéficiaire'},
      {name: 'code_siret', label: 'Siret'},
      {name: 'type_etablissement', label: `Type d'établissement`},
      {name: 'NEj', label: 'NEj'},
      {name: 'NPosteEj', label: 'NPosteEj'},
      {
        name: 'DateModificationEj',
        label: 'DateModificationEj',
        renderFn: (row, col) => row[col.name] ? dateFormat(row[col.name]) : row[col.name]
      },
      {name: 'CompteBudgetaire', label: 'Compte budgetaire'},
      {name: 'ContratEtatRegion', label: 'Contrat État-Région'},
      {
        name: 'Montant', label: 'Montant',
        renderFn: (row, col) => row[col.name] ? moneyFormat.format(row[col.name]) : row[col.name],
        aggregateReducer: AggregatorFns.sum,
        aggregateRenderFn: (aggregateValue) => aggregateValue ? moneyFormat.format(aggregateValue) : aggregateValue,
      },
    ]);
  }
}
