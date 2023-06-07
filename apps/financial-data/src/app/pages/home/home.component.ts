import { Component, inject, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  PreferenceUsersHttpService,
  SavePreferenceDialogComponent,
} from 'apps/preference-users/src/public-api';
import {
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import { ActivatedRoute, Data } from '@angular/router';
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
import { AuditHttpService } from '@services/http/audit.service';
import { QueryParam } from '@models/marqueblanche/query-params.model';
import { MarqueBlancheParsedParamsResolverModel } from '../../resolvers/marqueblanche-parsed-params.resolver';
import { NGXLogger } from 'ngx-logger';
import { delay } from 'rxjs';
import { PreFilters } from '@models/search/prefilters.model';

@Component({
  selector: 'financial-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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
  preFilter?: PreFilters;

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
    private _gridFullscreen: GridInFullscreenStateService,
    private _logger: NGXLogger,
  ) {
    const moneyFormat = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    });

    this.columnsMetaData = new ColumnsMetaData([
      { name: 'siret',
        label: 'Bénéficiaire',
        renderFn: (row, col) =>
            row[col.name] ?  row[col.name]['nom_beneficiare'] : ''
      },
      {
        name: 'montant_ae',
        label: 'Montant engagé',
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
      {
        name: 'montant_cp',
        label: 'Montant payé',
        renderFn: (row, col) =>
          row[col.name] > 0 ? moneyFormat.format(row[col.name]) : "",
        aggregateReducer: AggregatorFns.sum,
        aggregateRenderFn: (aggregateValue) =>
          aggregateValue ? moneyFormat.format(aggregateValue) : aggregateValue,
        columnStyle: {
          'text-align': 'right',
          'min-width': '16ex',
          'flex-grow': '0',
        },
      },
      { name: 'theme',
        label: 'Thème',
        renderFn: (row, _col) => row['programme']['theme'] ?? '',
      },
      {
        name: 'nom_programme',
        label: 'Programme',
        renderFn: (row, _col) => row['programme']['code'] +' - '+ row['programme']['label'] ?? '',
      },
      {
        name: 'domaine',
        label: 'Domaine fonctionnel',
        renderFn: (row, _col) => row['domaine_fonctionnel'] ?
        row['domaine_fonctionnel']['code'] + ' - ' + row['domaine_fonctionnel']['label'] : '',
      },
      {
        name: 'ref_programmation',
        label: 'Ref Programmation',
        renderFn: (row, _col) =>
           row['referentiel_programmation']['code'] + ' - ' + ( row['referentiel_programmation']['label'] ?? ''),
      },
      {
        name: 'label_commune',
        label: 'Commune',
        renderFn: (row, _col) => row['commune']['label'],
      },
      {
        name: 'siret',
        label: 'Siret',
        renderFn: (row, col) => row[col.name] ?  row[col.name]['code'] : '',
        columnStyle: {
          'min-width': '16ex',
          'flex-grow': '0',
        },
      },
      {
        name: 'type_etablissement',
        label: `Type d'établissement`,
        renderFn: (row, _col) =>
          row['siret']['categorie_juridique'] !== null ? row['siret']['categorie_juridique'] : 'Non renseigné',
      },
      {
        name: 'date_cp',
        label: 'Date dernier paiement',
        renderFn: (row, col) =>
         row[col.name] ? new Date(row[col.name]).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric'}): '',
      },
      {
        name: 'annee',
        label: 'Année d\'engagement',
        columnStyle: {
          'min-width': '18ex',
          'flex-grow': '0',
        },
      },
    ]);

    this.preFilter = undefined;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param) => {
      /* */
      if (param[QueryParam.Uuid]) {
        this.preferenceService
          .getPreference(param[QueryParam.Uuid])
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

    this.route.data
    .pipe(delay(0))
    .subscribe((data: Data) => {

      let response = data as { mb_parsed_params: MarqueBlancheParsedParamsResolverModel }

      let mb_has_params = response.mb_parsed_params?.data?.has_marqueblanche_params;
      let mb_group_by = response.mb_parsed_params?.data?.group_by;
      let mb_fullscreen = response.mb_parsed_params?.data?.fullscreen;

      if (!mb_has_params)
        return;

      if (mb_group_by && mb_group_by?.length > 0) {
        this._logger.debug(`Reception du paramètre group_by de la marque blanche, application des groupes: ${mb_group_by}`);
        let _groupingColumns: GroupingColumn[] = mb_group_by?.map(col_name => { 
          return {columnName: col_name } as GroupingColumn;
        });
        this.groupingColumns = _groupingColumns;
      }

      if (mb_fullscreen) this.toggle_grid_fullscreen();
    });

    this.auditService.getLastDateUpdateData().subscribe((response) => {
      if (response.date) {
        this.lastImportDate = response.date;
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
      maxHeight: '100vh',
      data: { row },
    });
  }
}
