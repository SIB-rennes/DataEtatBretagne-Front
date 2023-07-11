import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { ChargementOuErreurComponent } from '../chargement-ou-erreur/chargement-ou-erreur.component';
import { InformationsSupplementairesService } from '../services/informations-supplementaires.service';
import { OuNonRenseignePipe } from 'apps/common-lib/src/public-api';
import { Dossier } from '@models/demarche_simplifie/demarche-graphql';



@Component({
  standalone: true,
  selector: 'financial-informations-demarche-simplifie',
  templateUrl: './detail-api-demarche-simplifie.component.html',
  styleUrls: ['../commun-informations-supplementaires.scss'],
  imports: [
    ChargementOuErreurComponent,

    NgIf,
    AsyncPipe,
    NgFor,
    CurrencyPipe,
    NgTemplateOutlet,

    DatePipe,
    OuNonRenseignePipe,
  ],
})
export class DetailApiDemarcheSimplifieComponent {
  public dossier!: Dossier;
  public title_demarche!: string | undefined;

  public moneyFormat = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });


  constructor(private service: InformationsSupplementairesService) {
    service.viewService
      .api_find_dossier_demarche_simplifie$()
      .subscribe((dossier) => (this.dossier = dossier));

    service.viewService
      .api_demarche_light$()
      .subscribe((demarche) => (this.title_demarche = demarche.title));
  }

  get vService() {
    return this.service.viewService;
  }

  public getValueChamp(label: string) {
    return this.dossier.champs.find((champ) => champ.label === label)
      ?.stringValue;
  }

  public getValueAnnotations(label: string) {
    return this.dossier.annotations.find((anno) => anno.label === label)
      ?.stringValue;
  }

  public getMontant(label: string) {
    const montant = this.getValueChamp(label) as String;
    return this.moneyFormat.format(Number(montant));
  }

  public get montantAccorde() {
    const montant = this.getValueAnnotations("Montant de la subvention accordée") as String;
    return this.moneyFormat.format(Number(montant));
  }

}
