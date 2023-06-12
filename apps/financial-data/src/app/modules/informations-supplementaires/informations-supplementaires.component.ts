import {
  AsyncPipe,
  NgIf,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ChargementOuErreurComponent } from './chargement-ou-erreur/chargement-ou-erreur.component';
import { DetailApiDataSubventionsComponent } from './detail-api-data-subventions/detail-api-data-subventions.component';
import { DetailApiEntrepriseComponent } from './detail-api-entreprise/detail-api-entreprise.component';
import {
  InformationSupplementairesViewService,
  InformationsSupplementairesService,
} from './informations-supplementaires.service';
import { OuNonRenseignePipe } from 'apps/common-lib/src/public-api';
import { EtablissementLight } from './models/EtablissementLight';
import { SubventionLight } from './models/SubventionLight';
import { DemarcheLight } from './models/DemarcheLight';
import { DetailApiDemarcheSimplifieComponent } from './detail-api-demarche-simplifie/detail-api-demarche-simplifie.component';
import { FinancialDataModel } from '@models/financial/financial-data.models';

export enum View {
  light = 'light',
  full_api_entreprise = 'full_api_entreprise',
  full_api_data_subventions = 'full_api_data_subventions',
  full_api_demarche = 'full_api_demarche',
  full = 'full',
}

@Component({
  standalone: true,
  selector: 'financial-informations-supplementaires',
  templateUrl: './informations-supplementaires.component.html',
  styleUrls: [
    './commun-informations-supplementaires.scss',
    './informations-supplementaires.component.scss',
  ],
  imports: [
    NgIf,
    AsyncPipe,
    NgTemplateOutlet,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,

    ChargementOuErreurComponent,
    DetailApiEntrepriseComponent,
    DetailApiDataSubventionsComponent,
    DetailApiDemarcheSimplifieComponent,
    OuNonRenseignePipe,
  ],
  providers: [InformationsSupplementairesService],
})
export class InformationsSupplementairesComponent implements OnInit {
  view: View = View.light;

  private _financial: FinancialDataModel | undefined = undefined;

  get financial() {
    return this._financial!;
  }
  @Input() set financial(financial) {
    this._financial = financial;
    this.setup();
  }


  entreprise_light: EtablissementLight | undefined;
  api_subvention_light$: Observable<SubventionLight> | undefined;
  api_demarche_simplifie_light$: Observable<DemarcheLight | null> | undefined;

  ngOnInit() {
    let data: FinancialDataModel =
      this.route.snapshot.data['financial_data'];
    this._init_from_resolver_model(data);
  }

  constructor(
    private route: ActivatedRoute,
    private service: InformationsSupplementairesService
  ) {}


  get vService(): InformationSupplementairesViewService {
    return this.service.viewService;
  }

  setup() {
    if (this._financial === undefined) return;

    this.service.setupViewModelService(this._financial);
    this.api_demarche_simplifie_light$ = this.vService.api_demarche_light$();
    this.entreprise_light = this.vService.entreprise_light();
    this.api_subvention_light$ = this.vService.api_subvention_light$();
  }

  _init_from_resolver_model(data: FinancialDataModel) {
    if (data === undefined) return;

    this.financial = data;

    this.view = View.full;
  }

  on_click_full_api_entreprise() {
    this.view = View.full_api_entreprise;
  }

  on_click_full_api_data_subventions() {
    this.view = View.full_api_data_subventions;
  }

  on_click_demarche_simplifie() {
    this.view = View.full_api_demarche;
  }

  open_in_newtab() {
    this.service.viewService.open_in_newtab();
  }
}
