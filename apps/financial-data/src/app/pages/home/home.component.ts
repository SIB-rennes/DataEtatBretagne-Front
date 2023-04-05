import { Component, inject, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
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
import { GridInFullscreenStateService } from 'apps/common-lib/src/lib/services/grid-in-fullscreen-state.service';
import {
  AggregatorFns,
  ColumnsMetaData,
  GroupingColumn,
  RowData,
  TableData,
} from 'apps/grouping-table/src/lib/components/grouping-table/group-utils';
import { GroupingConfigDialogComponent } from 'apps/grouping-table/src/lib/components/grouping-config-dialog/grouping-config-dialog.component';
import { InformationsSupplementairesDialogComponent } from '../../modules/informations-supplementaires/informations-supplementaires-dialog/informations-supplementaires-dialog.component';
import { AuditHttpService } from '@services/audit.service';

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

  lastImportDate: string | null = null;

  groupingColumns: GroupingColumn[] = [
    { columnName: 'nom_programme' },
    { columnName: 'type_etablissement' },
    { columnName: 'label_commune' },
  ];

  get grid_fullscreen() {
    return this._gridFullscreen.fullscreen;
  }
  toggle_grid_fullscreen() {
    this._gridFullscreen.fullscreen = !this.grid_fullscreen;
  }
  get fullscreen_label() {
    if (!this.grid_fullscreen) return 'Agrandir le tableau';
    else return 'Rétrécir le tableau';
  }

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private preferenceService: PreferenceUsersHttpService,
    private auditService: AuditHttpService,
    private _gridFullscreen: GridInFullscreenStateService
  ) {
    const moneyFormat = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });

    this.columnsMetaData = new ColumnsMetaData([
      { name: 'nom_beneficiaire', label: 'Bénéficiaire' },
      {
        name: 'Montant',
        label: 'Montant',
        sub_label: "(autorisation d'engagement)",
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
        name: 'Annee',
        label: 'Année',
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
            this.alertService.openInfo(
              `Application du filtre ${preference.name}`
            );
          });
      }
    });

    const dateFormat = (dateStr: string) =>
      dateStr ? this.datePipe.transform(dateStr, 'dd/MM/yyyy à HH:mm') : '';
    this.auditService.getLastDateUpdateData().subscribe((response) => {
      if (response.date) {
        // date au format UTC
        const utcDate = new Date(response.date);
        utcDate.setUTCMinutes(
          utcDate.getMinutes() - utcDate.getTimezoneOffset()
        );
        const localDate = utcDate.toLocaleString('fr-FR');
        this.lastImportDate = dateFormat(localDate);
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
      if (result) this.newFilter = undefined;
    });
  }

  onRowClick(row: RowData) {
    this.dialog.open(InformationsSupplementairesDialogComponent, {
      width: '100%',
      data: { row },
    });
  }
}
