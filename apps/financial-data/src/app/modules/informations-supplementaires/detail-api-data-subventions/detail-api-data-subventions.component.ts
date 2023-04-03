import { AsyncPipe, CurrencyPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ChargementOuErreurComponent } from '../chargement-ou-erreur/chargement-ou-erreur.component';
import { InformationsSupplementairesService, SubventionFull } from '../informations-supplementaires.service';
import { OuNonRenseignePipe } from 'apps/common-lib/src/public-api';

@Component({
  standalone: true,
  selector: 'financial-informations-supplementaires-detail-subventions',
  templateUrl: './detail-api-data-subventions.component.html',
  styleUrls: [ '../commun-informations-supplementaires.scss', './detail-api-data-subventions.component.scss'],
  imports: [
    ChargementOuErreurComponent,

    NgIf, AsyncPipe, CurrencyPipe,
    NgTemplateOutlet,

    OuNonRenseignePipe,
  ],
})
export class DetailApiDataSubventionsComponent {

  public info: SubventionFull | null = null;

  get vService() { return this.service.viewService }

  constructor(private service: InformationsSupplementairesService) {
    service.viewService.api_subvention_full$()
    .subscribe(
      (subvention) => {
        this.info = subvention;
      }
    )
  }

  stringify(data: any) {
    return JSON.stringify(data)
  }

  private get action()  {
    let actions = this.info?.subvention?.actions_proposees || []
    if ( actions.length < 1 )
      return null;
    return actions[0];
  }

  get objectif() {
    let action = this.action
    return action?.intitule
  }

  get description() {
    let action = this.action
    return action?.objectifs
  }

  get a_aucune_info() {
    return this.service.viewService.subvention_full_has_no_info(this.info)
  }
}
