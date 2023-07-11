import { Injectable } from '@angular/core';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import {
  ExternalAPIsService,
  InfoApiEntreprise,
} from 'apps/clients/apis-externes';
import { EntrepriseFull } from '../models/EntrepriseFull';
import { PersonneMoraleAttributsCorrige } from '../models/correction-api-externes/PersonneMoraleAttributsCorrige';
import { ActivitePrincipaleCorrige } from '../models/correction-api-externes/ActivitePrincipaleCorrige';
import { TrancheEffectifCorrige } from '../models/correction-api-externes/TrancheEffectifCorrige';
import { DemarcheHttpService } from '@services/http/demarche.service';
import { InformationSupplementairesViewService } from './informations-supplementaires.viewservice';

export function fromInfoApiEntreprise(info: InfoApiEntreprise): EntrepriseFull {
  return {
    ...info,
    quick: {
      personne_morale: info.donnees_etablissement.unite_legale
        .personne_morale_attributs as PersonneMoraleAttributsCorrige,
      activite_principale: info.donnees_etablissement
        .activite_principale as ActivitePrincipaleCorrige,
      tranche_effectif: info.donnees_etablissement
        .tranche_effectif_salarie as TrancheEffectifCorrige,
      ess: (info.donnees_etablissement.unite_legale as any)[
        'economie_sociale_et_solidaire'
      ],
    },
  };
}

@Injectable()
export class InformationsSupplementairesService {
  private _viewService: InformationSupplementairesViewService | undefined;

  get viewService() {
    return this._viewService!;
  }

  constructor(
    private demarche: DemarcheHttpService,
    private ea: ExternalAPIsService
  ) {}

  setupViewModelService(financial_data: FinancialDataModel) {
    let viewService = new InformationSupplementairesViewService(
      this.demarche,
      this.ea,
      financial_data
    );
    this._viewService = viewService;
  }
}
