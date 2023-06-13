import { Injectable } from '@angular/core';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import {
  ExternalAPIsService,
  InfoApiEntreprise,
  InfoApiSubvention,
  ModelError,
  RepresentantLegal,
  Subvention,
} from 'apps/clients/apis-externes';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { _path_full } from './routes';
import { SubventionFull } from './models/SubventionFull';
import { EntrepriseFull } from './models/EntrepriseFull';
import { PersonneMoraleAttributsCorrige } from './models/correction-api-externes/PersonneMoraleAttributsCorrige';
import { ActivitePrincipaleCorrige } from './models/correction-api-externes/ActivitePrincipaleCorrige';
import { TrancheEffectifCorrige } from './models/correction-api-externes/TrancheEffectifCorrige';
import { EtablissementLight } from './models/EtablissementLight';
import { SubventionLight } from './models/SubventionLight';
import { HttpContext, HttpErrorResponse } from '@angular/common/http';
import { BYPASS_ALERT_INTERCEPTOR } from 'apps/common-lib/src/public-api';
import { DemarcheHttpService } from '@services/http/demarche.service';
import { SourceFinancialData } from '@models/financial/common.models';

function fromInfoApiEntreprise(info: InfoApiEntreprise): EntrepriseFull {
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

export class InformationSupplementairesViewService {
  private _options = {
    context: new HttpContext().set(BYPASS_ALERT_INTERCEPTOR, true),
  };

  private _api_subvention$:
    | Observable<InfoApiSubvention | undefined>
    | undefined;
  private _api_entreprise_info$: Observable<InfoApiEntreprise> | undefined;

  constructor(
    private demarcheService: DemarcheHttpService,
    private ae: ExternalAPIsService,
    private financial: FinancialDataModel
  ) {}

  open_in_newtab() {
    let id = '' + this.financial.id;
    window.open(_path_full(this.financial.source, id));
  }

  _map_subvention_light(
    subvention: Subvention | null,
    representantLegal: RepresentantLegal | null
  ): SubventionLight {
    let objectifs = null;

    if (
      subvention?.actions_proposees[0] &&
      subvention?.actions_proposees[0].intitule
    ) {
      objectifs = subvention.actions_proposees[0].intitule;
    }

    let has_more_info = subvention != null || representantLegal != null;

    return {
      objectifs,
      has_more_info,
    };
  }

  _president(representants: RepresentantLegal[]): RepresentantLegal | null {
    if (representants == undefined) return null;

    for (const representant of representants) {
      if (representant?.role == 'Président') return representant;
    }
    return null;
  }

  _extract_error(err: HttpErrorResponse) {
    let defaultError: ModelError = {
      code: 'UNKNOWN',
      message: 'Le service API externe répond mal.',
    };

    let actual = err?.error || defaultError;

    return actual;
  }

  entreprise_light(): EtablissementLight {
    return {
      siret: this.financial.siret.code,
      nom: this.financial.siret.nom_beneficiare,
    } as EtablissementLight;
  }
  // POC DS
  api_demarche_light$(): Observable<{
    has_more_info: boolean;
    title?: string;
  }> {
    console.log(this.financial);
    const code_depart = this.financial.commune.code.substring(0, 2);
    const annee = this.financial.annee;
    const code_ref = this.financial.referentiel_programmation.code;

    // FIXME - POC API DEMARCHE_SIMPLIFIE
    // DEMARCHE 49721 pour le 29, Annee 2022 sur programmation DTER
    if (code_depart === '29' && annee === 2022 && code_ref === '0119010101A6') {
      return this.demarcheService.getDemarcheLight(49721).pipe(
        map((demarche) => {
          return { has_more_info: true, title: demarche?.title };
        })
      );
    }
    return of({ has_more_info: false });
  }

  api_demarche_error: ModelError | null = null;
  api_find_dossier_demarche_simplifie$() {
    if (this.financial.source !== SourceFinancialData.CHORUS) {
      this.api_demarche_error = {
        code: 'NOT_FOUND',
        message: "Aucun dossier correspondant n'a été trouvé dans la démarche",
      } as ModelError;
      throw Error(
        "Aucun dossier correspondant n'a été trouvé dans la démarche"
      );
    }

    const montant = this.financial.montant_ae;
    const siret = this.financial.siret.code;

    // FIXME - POC API DEMARCHE_SIMPLIFIE
    // DEMARCHE 49721 pour le 29, Annee 2022 sur programmation DTER

    return this.demarcheService
      .foundDossierWithDemarche(49721, siret, montant)
      .pipe(
        map((dossier) => {
          if (dossier === null) {
            this.api_demarche_error = {
              code: 'NOT_FOUND',
              message:
                "Aucun dossier correspondant n'a été trouvé dans la démarche",
            } as ModelError;
            throw new Error();
          }
          return dossier;
        }),
        catchError((err) => {
          this.api_demarche_error = {
            code: 'NOT_FOUND',
            message:
              "Aucun dossier correspondant n'a été trouvé dans la démarche",
          } as ModelError;
          throw err;
        })
      );
  }

  api_subvention_light_error: ModelError | null = null;
  api_subvention_light$() {
    let light = forkJoin({
      subvention: this.api_subvention_subvention$,
      contact: this.api_subvention_president$,
    }).pipe(
      map((full) => this._map_subvention_light(full.subvention, full.contact)),
      catchError((err) => {
        this.api_subvention_light_error = this._extract_error(err);
        throw err;
      })
    );
    return light;
  }

  api_subvention_full_error: ModelError | null = null;
  api_subvention_full$(): Observable<SubventionFull> {
    let full = forkJoin({
      siret: this.financial.siret.code,
      subvention: this.api_subvention_subvention$,
      contact: this.api_subvention_president$,
    }).pipe(
      catchError((err) => {
        this.api_subvention_full_error = this._extract_error(err);
        throw err;
      })
    );
    return full;
  }

  api_entreprise_full_error: ModelError | null = null;
  api_entreprise_full$(): Observable<EntrepriseFull> {
    return this.api_entreprise_info$.pipe(
      map((info) => fromInfoApiEntreprise(info)),
      catchError((err) => {
        this.api_entreprise_full_error = this._extract_error(err);
        throw err;
      })
    );
  }

  private get api_subvention_president$() {
    let president = this.api_subvention_representants_legaux$.pipe(
      map((representants) => this._president(representants))
    );

    return president;
  }

  private get api_entreprise_info$() {
    if (this._api_entreprise_info$ == undefined) {
      this._api_entreprise_info$ = this.ae.getInfoEntrepriseCtrl(
        this.financial.siret.code,
        'body',
        false,
        this._options
      );
    }

    return this._api_entreprise_info$;
  }

  private get api_subvention_subvention$() {
    if (this.financial.source === SourceFinancialData.CHORUS) {
      return this.api_subvention$.pipe(
        map((subvention) => {
          const ej = this.financial.n_ej;
          let filtered =
            subvention?.subventions.filter((s) => s?.ej === ej) || [];
          if (filtered.length >= 1) {
            let subvention = filtered[0];
            return subvention;
          } else return null;
        })
      );
    }
    return of(null);
  }

  private get api_subvention_representants_legaux$() {
    if (this.financial.source === SourceFinancialData.CHORUS) {
      this.api_subvention$.pipe(
        map((subvention) => {
          return subvention?.contacts || [];
        })
      );
    }
    return of([]);
  }

  private get api_subvention$() {
    if (this._api_subvention$ === undefined) {
      let siret = this.financial.siret.code;
      return this.ae
        .getInfoSubventionCtrl(siret!, 'body', false, this._options)
        .pipe(shareReplay(1));
    }
    return this._api_subvention$;
  }

  subvention_full_has_no_info(info: SubventionFull | null) {
    function vide(a: any) {
      return a === undefined || a === null;
    }
    return vide(info) || (vide(info?.contact) && vide(info?.subvention));
  }
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
