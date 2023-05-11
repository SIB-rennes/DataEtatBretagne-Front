import { Injectable } from '@angular/core';
import { FinancialDataModel } from '@models/financial-data.models';
import { FinancialDataHttpService } from '@services/financial-data-http.service';
import {
  ExternalAPIsService,
  InfoApiEntreprise,
  InfoApiSubvention,
  ModelError,
  RepresentantLegal,
  Subvention,
} from 'apps/clients/apis-externes';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
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
import { Demarche } from '@models/demarche_simplifie/demarche-graphql';
import { DemarcheHttpService } from '@services/demarche.service';
import { DemarcheLight } from './models/DemarcheLight';

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

  private _ligne_chorus$:
    | Observable<FinancialDataModel | undefined>
    | undefined;
  private _api_subvention$:
    | Observable<InfoApiSubvention | undefined>
    | undefined;
  private _api_demarche_simplifie$: Observable<Demarche> | undefined;
  private _api_entreprise_info$: Observable<InfoApiEntreprise> | undefined;

  constructor(
    private financial: FinancialDataHttpService,
    private demarcheService: DemarcheHttpService,
    private ae: ExternalAPIsService,
    private ej: string,
    private poste_ej: number
  ) {}

  open_in_newtab() {
    let poste = '' + this.poste_ej;
    window.open(_path_full(this.ej, poste));
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

  api_entreprise_light_error: ModelError | null = null;
  api_entreprise_light$(): Observable<EtablissementLight> {
    return this.ligne_chorus$.pipe(
      map((ligne) => {
        let actual = ligne!;
        return {
          siret: actual.code_siret,
          nom: actual.nom_beneficiaire,
        };
      }),
      catchError((err) => {
        this.api_entreprise_light_error = this._extract_error(err);
        throw err;
      })
    );
  }

  api_demarche_light$() {
    return this.ligne_chorus$.pipe(
      mergeMap((ligne) => {
        let actual = ligne!;
        console.log('ici demarche');
        console.log(actual);
        if (
          actual.code_departement === '29' &&
          actual.Annee === 2022 &&
          actual.code_ref_programmation === '0119010101A6'
        ) {
          return this.demarcheService.getDemarcheLight(49721).pipe(
            map((demarche) => {
              return { has_more_info: true, title: demarche?.title };
            })
          );
        }
        return of({ has_more_info: false });
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
      siret: this.ligne_chorus$.pipe(map((ligne) => ligne?.code_siret!)),
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
      this._api_entreprise_info$ = this.ligne_chorus$.pipe(
        mergeMap((ligne) => {
          let siret = ligne?.code_siret;
          return this.ae.getInfoEntrepriseCtrl(
            siret!,
            'body',
            false,
            this._options
          );
        })
      );
    }

    return this._api_entreprise_info$;
  }

  private get api_subvention_subvention$() {
    return forkJoin({
      ligne_chorus: this.ligne_chorus$,
      subvention: this.api_subvention$,
    }).pipe(
      map((joined) => {
        let ej = joined.ligne_chorus?.NEj;

        let filtered =
          joined.subvention?.subventions.filter((s) => s?.ej === ej) || [];
        if (filtered.length >= 1) {
          let subvention = filtered[0];
          return subvention;
        } else return null;
      })
    );
  }

  private get api_subvention_representants_legaux$() {
    return forkJoin({
      ligne_chorus: this.ligne_chorus$,
      subvention: this.api_subvention$,
    }).pipe(
      map((joined) => {
        return joined.subvention?.contacts || [];
      })
    );
  }

  private get api_subvention$() {
    if (this._api_subvention$ == undefined) {
      this._api_subvention$ = this.ligne_chorus$.pipe(
        mergeMap((ligne) => {
          let siret = ligne?.code_siret;
          return this.ae.getInfoSubventionCtrl(
            siret!,
            'body',
            false,
            this._options
          );
        }),
        shareReplay(1)
      );
    }
    return this._api_subvention$;
  }

  public get ligne_chorus$() {
    if (this._ligne_chorus$ == undefined)
      this._ligne_chorus$ = this.financial
        .get(this.ej, this.poste_ej)
        .pipe(shareReplay(1));
    return this._ligne_chorus$;
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
    private financial: FinancialDataHttpService,
    private demarche: DemarcheHttpService,
    private ea: ExternalAPIsService
  ) {}

  setupViewModelService(ej: string, poste_ej: number) {
    let viewService = new InformationSupplementairesViewService(
      this.financial,
      this.demarche,
      this.ea,
      ej,
      poste_ej
    );
    this._viewService = viewService;
  }
}
