import { Injectable } from "@angular/core";
import { FinancialDataModel } from "@models/financial-data.models";
import { FinancialDataHttpService } from "@services/financial-data-http.service"
import { ExternalAPIsService, InfoApiEntreprise, InfoApiSubvention, ModelError, RepresentantLegal, Subvention } from "apps/clients/apis-externes";
import { forkJoin, Observable } from "rxjs";
import { catchError, map, mergeMap, shareReplay } from 'rxjs/operators';
import { _path_full } from "./routes";


export interface EtablissementLight {
  siret: string
  nom: string
}

export interface SubventionLight {
  objectifs: string | null
}

export interface SubventionFull {
  subvention: Subvention | null,
  contact: RepresentantLegal | null,
}

//
// XXX: On redéfinit des types que l'API devrait fournir mais 
// le code généré a des ratés
//
type PersonneMoraleAttributsCorrige = {
  raison_sociale: string | null
  sigle: string | null
}
type ActivitePrincipaleCorrige = {
  code: string
  nomenclature: string
  libelle: string | null
}
type TrancheEffectifCorrige = {
  code: string | null
  intitule: string | null
}

export interface EntrepriseFull extends InfoApiEntreprise {
  quick: {
    personne_morale: PersonneMoraleAttributsCorrige
    activite_principale: ActivitePrincipaleCorrige
    tranche_effectif: TrancheEffectifCorrige
    ess: boolean
  }
}

function fromInfoApiEntreprise(info: InfoApiEntreprise): EntrepriseFull {
  return {
    ...info,
    quick: {
      personne_morale: (info.donnees_etablissement.unite_legale.personne_morale_attributs as PersonneMoraleAttributsCorrige),
      activite_principale: (info.donnees_etablissement.activite_principale as ActivitePrincipaleCorrige),
      tranche_effectif: (info.donnees_etablissement.tranche_effectif_salarie as TrancheEffectifCorrige),
      ess: (info.donnees_etablissement.unite_legale as any)['economie_sociale_et_solidaire'],
    }
  }
}

export class InformationSupplementairesViewService {

  private _ligne_chorus$: Observable<FinancialDataModel | undefined> | undefined
  private _api_subvention$: Observable<InfoApiSubvention | undefined> | undefined;
  private _api_entreprise_info$: Observable<InfoApiEntreprise> | undefined;

  constructor(
    private financial: FinancialDataHttpService,
    private ae: ExternalAPIsService,
    private ej: string, private poste_ej: number) { }

  open_in_newtab() {
    let poste = '' + this.poste_ej
    window.open(_path_full(this.ej, poste))
  }

  _map_subvention_light(subvention: Subvention | null): SubventionLight {

    let objectifs = null;

    if (subvention?.actions_proposees[0] && subvention?.actions_proposees[0].intitule) {
      objectifs = subvention.actions_proposees[0].intitule;
    }

    return {
      objectifs
    }
  }

  _president(representants: RepresentantLegal[]): RepresentantLegal | null {

    if (representants == undefined)
      return null;

    for (const representant of representants) {
      if (representant?.role == "Président")
        return representant
    }
    return null;
  }

  api_entreprise_light_error: ModelError | null = null;
  api_entreprise_light$(): Observable<EtablissementLight> {
    return this.ligne_chorus$
      .pipe(
        map(ligne => {
          let actual = ligne!;
          return {
            siret: actual.code_siret,
            nom: actual.nom_beneficiaire,
          }
        }),
        catchError(err => {
          this.api_entreprise_light_error = err;
          throw err;
        })
      )
  }

  api_subvention_light_error: ModelError | null = null;
  api_subvention_light$() {
    return this.api_subvention_subvention$
      .pipe(
        map((subvention) => this._map_subvention_light(subvention)),
        catchError(err => {
          this.api_subvention_light_error = err;
          throw err;
        })
      );
  }

  api_subvention_full_error: ModelError | null = null;
  api_subvention_full$(): Observable<SubventionFull> {
    let full = forkJoin({
      subvention: this.api_subvention_subvention$,
      contact: this.api_subvention_president$,
    })
      .pipe(
        catchError(err => {
          this.api_subvention_full_error = err;
          throw err
        })
      );
    return full;
  }

  api_entreprise_full_error: ModelError | null = null;
  api_entreprise_full$(): Observable<EntrepriseFull> {
    return this.api_entreprise_info$
      .pipe(
        map((info) => fromInfoApiEntreprise(info)),
        catchError(err => {
          this.api_entreprise_full_error = err;
          throw err;
        })
      )
  }

  private get api_subvention_president$() {
    let president = this.api_subvention_representants_legaux$
      .pipe(
        map((representants) => this._president(representants))
      );

    return president;
  }

  private get api_entreprise_info$() {
    if (this._api_entreprise_info$ == undefined) {

      this._api_entreprise_info$ =
        this.ligne_chorus$
          .pipe(
            mergeMap((ligne) => {
              let siret = ligne?.code_siret

              return this.ae.getInfoEntrepriseCtrl(siret!)
            })
          )
    }

    return this._api_entreprise_info$;
  }

  private get api_subvention_subvention$() {

    return forkJoin({
      ligne_chorus: this.ligne_chorus$,
      subvention: this.api_subvention$,
    })
      .pipe(
        map((joined) => {
          let ej = joined.ligne_chorus?.NEj;

          let filtered = joined.subvention?.subventions.filter(s => s?.ej === ej) || []
          if (filtered.length >= 1) {
            let subvention = filtered[0];
            return subvention;
          }
          else
            return null;
        })
      );
  }

  private get api_subvention_representants_legaux$() {
    return forkJoin({
      ligne_chorus: this.ligne_chorus$,
      subvention: this.api_subvention$,
    })
      .pipe(
        map((joined) => {
          return joined.subvention?.contacts || []
        })
      )
  }

  private get api_subvention$() {

    if (this._api_subvention$ == undefined) {
      this._api_subvention$ = this.ligne_chorus$
        .pipe(
          mergeMap(
            (ligne) => {
              let siret = ligne?.code_siret;
              return this.ae.getInfoSubventionCtrl(siret!)
            }
          ),
          shareReplay(1),
        )
    }
    return this._api_subvention$;
  }

  private get ligne_chorus$() {
    if (this._ligne_chorus$ == undefined)
      this._ligne_chorus$ = this.financial.get(this.ej, this.poste_ej)
        .pipe(
          shareReplay(1)
        )
    return this._ligne_chorus$
  }

  subvention_full_has_no_info(info: SubventionFull | null) {
    function vide(a: any) {
      return (a === undefined) || (a === null);
    }
    return (vide(info))
      || ((vide(info?.contact)) && vide(info?.subvention))
  }
}

@Injectable()
export class InformationsSupplementairesService {

  private _viewService: InformationSupplementairesViewService | undefined;

  get viewService() { return this._viewService! }

  constructor(
    private financial: FinancialDataHttpService,
    private ea: ExternalAPIsService,
  ) { }

  setupViewModelService(ej: string, poste_ej: number) {
    let viewService = new InformationSupplementairesViewService(
      this.financial,
      this.ea,
      ej, poste_ej
    );
    this._viewService = viewService
  }
}
