import { Component, inject, OnInit } from '@angular/core';
import {
  AggregatorFns,
  ColumnsMetaData,
  GroupingColumn,
  TableData,
} from '../../components/grouping-table/group-utils';
import { DatePipe } from '@angular/common';
import { GroupingConfigDialogComponent } from '../../components/grouping-config-dialog/grouping-config-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  PreferenceUsersHttpService,
  SavePreferenceDialogComponent,
} from 'apps/preference-users/src/public-api';
import {
  JSONObject,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'apps/common-lib/src/public-api';

@Component({
  selector: 'financial-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private datePipe = inject(DatePipe);
  private dialog = inject(MatDialog);

  columnsMetaData: ColumnsMetaData;

  tableData?: TableData;

  /**
   * Filtre retourner par le formulaire de recherche
   */
  newFilter?: Preference;

  /**
   * Filtre à appliquer sur la recherche
   */
  preFilter: JSONObject | null;

  groupingColumns: GroupingColumn[] = [
    { columnName: 'nom_programme' },
    { columnName: 'type_etablissement' },
    { columnName: 'label_commune' },
  ];

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private preferenceService: PreferenceUsersHttpService
  ) {
    const moneyFormat = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });
    const dateFormat = (dateStr: string) =>
      dateStr ? this.datePipe.transform(dateStr, 'shortDate') : '';

    this.columnsMetaData = new ColumnsMetaData([
      { name: 'nom_beneficiaire', label: 'Bénéficiaire' },
      {
        name: 'Montant',
        label: 'Montant',
        renderFn: (row, col) =>
          row[col.name] ? moneyFormat.format(row[col.name]) : row[col.name],
        aggregateReducer: AggregatorFns.sum,
        aggregateRenderFn: (aggregateValue) =>
          aggregateValue ? moneyFormat.format(aggregateValue) : aggregateValue,
        columnStyle: {
          'text-align': 'right',
          'min-width': '16ex',
          'flex-grow': '0',
        },
      },
      { name: 'Theme', label: 'Thème' },
      {
        name: 'nom_programme',
        label: 'Programme',
        renderFn: (row, _col) =>
          row['code_programme'] + ' - ' + row['nom_programme'],
      },
      {
        name: 'domaine',
        label: 'Domaine fonctionnel',
        renderFn: (row, _col) => row['code_domaine'] + ' - ' + row['domaine'],
      },
      {
        name: 'ref_programmation',
        label: 'Ref Programmation',
        renderFn: (row, _col) =>
          row['code_ref_programmation'] + ' - ' + row['ref_programmation'],
      },
      {
        name: 'label_commune',
        label: 'Commune',
        renderFn: (row, _col) => row['label_commune'],
      },
      {
        name: 'code_siret',
        label: 'Siret',
        columnStyle: {
          'min-width': '16ex',
          'flex-grow': '0',
        },
      },
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
        columnStyle: {
          'min-width': '18ex',
          'flex-grow': '0',
        },
      },
    ]);

    this.preFilter = null;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param) => {
      if (param['uuid']) {
        this.preferenceService
          .getPreference(param['uuid'])
          .subscribe((preference) => {
            this.preFilter = preference.filters;

            if (preference.options && preference.options['grouping']) {
              this.groupingColumns = preference.options[
                'grouping'
              ] as GroupingColumn[];
            }
            this.alertService.openAlertSuccess(
              `Application du filtre ${preference.name}`
            );
          });
      }
    });
  }

  openGroupConfigDialog() {
    let dialogRef = this.dialog.open(GroupingConfigDialogComponent, {
      data: {
        columns: this.columnsMetaData.data,
        groupingColumns: this.groupingColumns,
      },
      width: '40rem',
      autoFocus: 'input',
    });
    dialogRef
      .afterClosed()
      .subscribe((updatedGroupingColumns: GroupingColumn[]) => {
        if (updatedGroupingColumns) {
          this.groupingColumns = updatedGroupingColumns;
        }
      });
  }

  public openSaveFilterDialog(): void {
    if (this.newFilter) {
      this.newFilter.options = { grouping: this.groupingColumns };
    }

    const dialogRef = this.dialog.open(SavePreferenceDialogComponent, {
      data: this.newFilter,
      width: '40rem',
      autoFocus: 'input',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.newFilter = undefined;
    });
  }
}
