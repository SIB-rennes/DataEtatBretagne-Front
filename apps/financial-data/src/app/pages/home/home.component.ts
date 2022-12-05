import { Component } from '@angular/core';
import tableData from './example_chorus.json';
import { ColumnsMetaData, GroupingColumn, TableData } from "../../components/grouping-table/group-utils";

@Component({
  selector: 'financial-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  columnsMetaData = new ColumnsMetaData([
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
    {name: 'DateModificationEj', label: 'DateModificationEj'},
    {name: 'CompteBudgetaire', label: 'Compte budgetaire'},
    {name: 'ContratEtatRegion', label: 'Contrat État-Région'},
    {name: 'Montant', label: 'Montant'},
  ]);

  tableData: TableData = tableData;

  groupingColumns: GroupingColumn[] = [
    {columnName: 'Theme'},
    {columnName: 'nom_programme'},
    {columnName: 'label ref programmation'},
  ];
}
