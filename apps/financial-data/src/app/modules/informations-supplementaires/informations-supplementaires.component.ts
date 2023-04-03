import { AsyncPipe, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InformationsSupplementairesResolverModel } from '@models/informations-supplementiares-resolver.model';
import { Observable } from 'rxjs';
import { ChargementOuErreurComponent } from './chargement-ou-erreur/chargement-ou-erreur.component';
import { DetailApiDataSubventionsComponent } from './detail-api-data-subventions/detail-api-data-subventions.component';
import { DetailApiEntrepriseComponent } from './detail-api-entreprise/detail-api-entreprise.component';
import { InformationsSupplementairesService } from './informations-supplementaires.service';
import { OuNonRenseignePipe } from 'apps/common-lib/src/public-api';
import { EtablissementLight } from './models/EtablissementLight';
import { SubventionLight } from './models/SubventionLight';

export enum View {
  light = 'light',
  full_api_entreprise = 'full_api_entreprise',
  full_api_data_subventions = 'full_api_data_subventions',
  full = 'full',
}

@Component({
  standalone: true,
  selector: 'financial-informations-supplementaires',
  templateUrl: './informations-supplementaires.component.html',
  styleUrls: ['./commun-informations-supplementaires.scss', './informations-supplementaires.component.scss'],
  imports: [
    NgIf, AsyncPipe,
    NgTemplateOutlet,
    NgSwitch, NgSwitchCase, NgSwitchDefault,

    ChargementOuErreurComponent,
    DetailApiEntrepriseComponent, DetailApiDataSubventionsComponent,
    OuNonRenseignePipe,
  ],
  providers: [InformationsSupplementairesService]
})
export class InformationsSupplementairesComponent implements OnInit {

  
  view: View = View.light;

  private _ej: string | undefined = undefined
  private _poste_ej: number | undefined = undefined

  get ej() { return this._ej! }
  @Input() set ej(v) {
    this._ej = v
    this.setup()
  }
  get poste_ej() { return this._poste_ej! }
  @Input() set poste_ej(v) {
    this._poste_ej = v;
    this.setup()
  }

  api_entreprise_light$: Observable<EtablissementLight> | undefined;
  api_subvention_light$: Observable<SubventionLight> | undefined;

  ngOnInit() {
    let data: InformationsSupplementairesResolverModel = this.route.snapshot.data['ligne_id']
    this._init_from_resolver_model(data);
  }

  constructor(private route: ActivatedRoute, private service: InformationsSupplementairesService) { }

  get ligne_exists() {
    return Boolean(this.ej) && Boolean(this.poste_ej);
  }

  get vService() {
    return this.service.viewService;
  }

  setup() {
    if (this._ej === undefined || this._poste_ej === undefined)
      return

    this.service.setupViewModelService(this.ej, this.poste_ej);
    this.api_entreprise_light$ = this.vService.api_entreprise_light$()
    this.api_subvention_light$ = this.vService.api_subvention_light$()
  }

  _init_from_resolver_model(data: InformationsSupplementairesResolverModel) {
    if (data === undefined)
      return

    this.ej = data.ej
    this.poste_ej = data.poste_ej

    this.view = View.full;
  }

  on_click_full_api_entreprise() {
    this.view = View.full_api_entreprise;
  }

  on_click_full_api_data_subventions() {
    this.view = View.full_api_data_subventions;
  }

  open_in_newtab() {
    this.service.viewService.open_in_newtab();
  }
}
