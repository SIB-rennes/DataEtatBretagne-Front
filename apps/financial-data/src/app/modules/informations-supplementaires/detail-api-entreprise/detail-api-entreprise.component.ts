import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { ChargementOuErreurComponent } from '../chargement-ou-erreur/chargement-ou-erreur.component';
import { EntrepriseFull, InformationsSupplementairesService } from '../informations-supplementaires.service';
import { OuNonRenseignePipe } from '../ou-non-renseigne.pipe';

@Component({
  standalone: true,
  selector: 'financial-informations-supplementaires-detail-entreprise',
  templateUrl: './detail-api-entreprise.component.html',
  styleUrls: ['../commun-informations-supplementaires.scss', './detail-api-entreprise.component.scss'],
  imports: [
    ChargementOuErreurComponent,

    NgIf, AsyncPipe, NgFor, CurrencyPipe,
    NgTemplateOutlet,

    DatePipe, OuNonRenseignePipe,
  ]
})
export class DetailApiEntrepriseComponent {

  public info: EntrepriseFull | null = null

  get vService() { return this.service.viewService }

  constructor(private service: InformationsSupplementairesService) {

    service.viewService.api_entreprise_full$().subscribe(
      (info) => this.info = info
    )
  }

  stringify(data: any) {
    return JSON.stringify(data)
  }

  lien_annuaire_entreprise(siret: string) {
    return `https://annuaire-entreprises.data.gouv.fr/etablissement/${siret}`
  }

  vue_tribool(b: boolean | undefined) {

    if (b === undefined || b === null)
      return `Non renseigné`

    if (b)
      return 'oui'
    else
      return 'non'
  }

  get lignes_adresse() {
    return [
      this.info?.donnees_etablissement.adresse.acheminement_postal.l1,
      this.info?.donnees_etablissement.adresse.acheminement_postal.l2,
      this.info?.donnees_etablissement.adresse.acheminement_postal.l3,
      this.info?.donnees_etablissement.adresse.acheminement_postal.l4,
      this.info?.donnees_etablissement.adresse.acheminement_postal.l5,
      this.info?.donnees_etablissement.adresse.acheminement_postal.l6,
      this.info?.donnees_etablissement.adresse.acheminement_postal.l7,
    ].filter(line => Boolean(line));
  }

  get label_ess() {
    return this.vue_tribool(this.info?.quick.ess);
  }

  get label_rge() {

    let a_rge_active = false

    let rges = this.info?.certifications_rge || []

    for (const rge of rges) {

      let exprirationstr = rge.data.date_expiration
      let expiration = Date.parse(exprirationstr)

      if (expiration > Date.now()) {
        a_rge_active = true;
        break;
      }
    }

    return this.vue_tribool(a_rge_active);
  }

  get label_qualibat() {
    let a_certif_qualibat = Boolean(this.info?.certification_qualibat);

    return this.vue_tribool(a_certif_qualibat);
  }

  get has_chiffre_d_affaires() {
    return Boolean(this.info?.chiffre_d_affaires) && (this.info!.chiffre_d_affaires.length > 0);
  }

}
