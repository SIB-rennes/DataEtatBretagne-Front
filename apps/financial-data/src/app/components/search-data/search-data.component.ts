import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import {
  switchMap,
  of,
  startWith,
  Observable,
  finalize,
  BehaviorSubject,
  debounceTime,
  Subscription,
} from 'rxjs';
import { BopModel } from '@models/refs/bop.models';
import { FinancialData, FinancialDataResolverModel } from '@models/financial/financial-data-resolvers.models';
import { FinancialDataModel } from '@models/financial/financial-data.models';
import { DatePipe } from '@angular/common';
import { RefSiret } from '@models/refs/RefSiret';
import {
  JSONObject,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import {
  AlertService,
  GeoModel,
  SearchParameters,
  SearchParameters_empty,
  TypeLocalisation,
} from 'apps/common-lib/src/public-api';
import { Bop } from '@models/search/bop.model';
import { Beneficiaire } from '@models/search/beneficiaire.model';
import { BudgetService } from '@services/budget.service';
import { NGXLogger } from 'ngx-logger';
import { PreFilters } from '@models/search/prefilters.model';
import { MarqueBlancheParsedParamsResolverModel } from '../../resolvers/marqueblanche-parsed-params.resolver';
import { AdditionalSearchParameters, empty_additional_searchparams } from './additional-searchparams';


@Component({
  selector: 'financial-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
  public readonly TypeLocalisation = TypeLocalisation;
  public searchForm!: FormGroup;

  public additional_searchparams: AdditionalSearchParameters = empty_additional_searchparams;

  public bop: BopModel[] = [];
  public themes: string[] = [];

  public filteredBeneficiaire: Observable<RefSiret[]> | null | undefined = null;

  public filteredBop: BopModel[] | undefined = undefined;

  /**
   * Indique si la recherche a été effectué
   */
  public searchFinish = false;

  /**
   * Indique si la recherche est en cours
   */
  public searchInProgress = new BehaviorSubject(false);

  /**
   * Affiche une erreur
   */
  public displayError = false;
  public error: Error | any | null = null;

  /**
   * Resultats de la recherche.
   */
  @Output() searchResultsEventEmitter = new EventEmitter<FinancialDataModel[]>();

  /**
   * Les donnees de la recherche
   */
  private _searchResult: FinancialDataModel[] | null = null;

  /**
   * Resultats de la recherche.
   */
  @Output() currentFilter = new EventEmitter<Preference>();

  @Input() public set preFilter(value: PreFilters | undefined) {
    try {
      this._apply_prefilters(value);
    } catch(e) {
      this.displayError = true;
      this.error = e;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private budgetService: BudgetService,
    private logger: NGXLogger,
  ) {
    // formulaire
    this.searchForm = new FormGroup({
      year: new FormControl<number[]>([], {
        validators: [
          Validators.min(2000),
          Validators.max(new Date().getFullYear()),
        ],
      }),

      filterBop: new FormControl<string>(''), // controls pour le filtre des bops

      bops: new FormControl<Bop | null>(null),
      theme: new FormControl<string | null>(null),
      beneficiaire: new FormControl<Beneficiaire | null>(null),
      location: new FormControl({ value: null, disabled: false }, []),
    });
  }

  ngOnInit(): void {
    // récupération des themes dans le resolver
    this.route.data.subscribe(
      (data: Data) => {
        let response = data as { financial: FinancialDataResolverModel, mb_parsed_params: MarqueBlancheParsedParamsResolverModel }

        let error = response.financial.error || response.mb_parsed_params?.error

        if (error) {
          this.displayError = true;
          this.error = error;
          return;
        }

        let financial = response.financial.data! as FinancialData;
        let mb_has_params = response.mb_parsed_params?.data?.has_marqueblanche_params;
        let mb_prefilter = response.mb_parsed_params?.data?.preFilters;

        this.displayError = false;
        this.themes = financial.themes;
        this.bop = financial.bop;

        this.filteredBop = this.bop;

        if (!mb_has_params)
          return

        this.logger.debug(`Mode marque blanche actif.`)
        if (mb_prefilter) {
          this.logger.debug(`Application des filtres`);
          this.preFilter = mb_prefilter;
        }
      }
    );

    this._setupFilters();
  }

  /**
   * Change la valeur du bop pour déclencher une nouvelle recherche de BOP associé aux themes
   */
  public onSelectTheme(_event: any): void {
    this.searchForm.patchValue( { filterBop: '', bops: null } );
  }

  /**
   * Action déclenché quand on annule le theme
   */
  public cancelTheme(): void {
    this.searchForm.patchValue({
      theme: null,
      filterBop: '',
      bops: null,
    });
  }

  public onSelectBeneficiaire(benef: RefSiret): void {
    this.searchForm.controls['beneficiaire'].setValue(benef);
  }

  public displayBeneficiaire(element: RefSiret): string {
    let code = element?.siret;
    let nom = element?.denomination;

    if (code && nom) {
      return `${nom} (${code})`;
    } else if (code) {
      return code;
    } else {
      return nom;
    }
  }

  public get beneficiaireControls(): FormControl | null {
    return this.searchForm.get('beneficiaire') as FormControl;
  }

  /**
   * Retourne le FormControl de location
   */
  public get locationControls(): FormControl {
    return this.searchForm.get('location') as FormControl;
  }

  /**
   * Retourne le ValidationErrors benefOrBopRequired
   */
  public get errorsBenefOrBop(): ValidationErrors | null {
    return this.searchForm.errors != null
      ? this.searchForm.errors['benefOrBopRequired']
      : null;
  }

  /**
   * lance la recherche des lignes d'engagement financière
   */
  private _search_subscription?: Subscription;
  public doSearch(): void {

    this._search_subscription?.unsubscribe();

    const formValue = this.searchForm.value;
    this.searchInProgress.next(true);

    // TODO: disparaitra lorsque l'on gérera le multi select beneficiaire dans le front
    let beneficiaires = this.additional_searchparams.beneficiaires;
    if ((!beneficiaires || beneficiaires.length === 0) && formValue.beneficiaire) {
      beneficiaires = [formValue.beneficiaire]
    }
    // 

    let search_parameters: SearchParameters = { 
      ...SearchParameters_empty,
      beneficiaires,
      bops: formValue.bops,
      themes: formValue.theme,
      years: formValue.year,
      locations:  formValue.location,

      domaines_fonctionnels: this.additional_searchparams?.domaines_fonctionnels || null,
      referentiels_programmation: this.additional_searchparams?.referentiels_programmation || null,
      source_region: this.additional_searchparams?.sources_region || null,
    }

    this._search_subscription = this.budgetService
      .search(search_parameters)
      .pipe(
        finalize(() => {
          this.searchInProgress.next(false);
        })
      )
      .subscribe({
        next: (response: FinancialDataModel[] | Error) => {
          this.searchFinish = true;
          this.currentFilter.next(this._buildPreference(formValue));
          this._searchResult = response as FinancialDataModel[];
          this.searchResultsEventEmitter.next(this._searchResult);
        },
        error: (err: Error) => {
          this.searchFinish = true;
          this._searchResult = [];
          this.currentFilter.next(this._buildPreference(formValue));
          this.searchResultsEventEmitter.next(this._searchResult);
          this.alertService.openAlertError(err.message, 8);
        },
      });
  }

  /**
   * Clean les donners undefined, null et vide pour enregistrer en tant que preference
   * @param object
   * @returns
   */
  private _buildPreference(object: JSONObject): Preference {
    const preference: Preference = { filters: {} };

    Object.keys(object).forEach((key) => {
      if (
        object[key] !== null &&
        object[key] !== undefined &&
        object[key] !== ''
      ) {
        preference.filters[key] = object[key];
      }
    });
    return preference;
  }

  public downloadCsv(): void {
    this.searchForm.markAllAsTouched(); // pour notifier les erreurs sur le formulaire
    if (this.searchForm.valid && !this.searchInProgress.value ) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      const csvdata = this.budgetService.getCsv(this._searchResult ?? []);

      console.log(csvdata);
       var url = URL.createObjectURL(csvdata);
          var a = document.createElement('a');
          a.href = url;
          a.download = this._filenameCsv();
          document.body.appendChild(a);
          a.click();

          this.searchInProgress.next(false);
    }
  }

  public reset(): void {
    this.searchFinish = false;
    this.searchForm.reset();
  }

  private _filenameCsv(): string {
    const formValue = this.searchForm.value;
    console.log(formValue);
    let filename = `${this.datePipe.transform(new Date(), 'yyyyMMdd')}_export`;
    if (formValue.location !== null) {
      const locations = formValue.location as GeoModel[];
      filename += '_' + locations[0].type + '-';
      locations
        .filter((loc) => loc.code)
        .map((loc) => loc.code)
        .join('-');
    }

    if (formValue.bops !== null) {
      const bops = formValue.bops as BopModel[];
      filename +=
        '_bops-' +
        bops
          .filter((bop) => bop.code)
          .map((bop) => bop.code)
          .join('-');
    }

    return filename + '.csv';
  }

  /**
   * filtrage des données des formulaires pour les autocomplete
   */
  private _setupFilters(): void {

    this.searchForm.controls['filterBop'].valueChanges.subscribe((value: string) => {
      this.filteredBop = this._filterBop(value ? value : '');
    });

    // filtre beneficiaire
    this.filteredBeneficiaire = this.searchForm.controls[
      'beneficiaire'
    ].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        if (value && value.length > 3) {
          return this.budgetService.filterRefSiret(value);
        }
        return of([]);
      })
    );
  }

  private _filterBop(value: string): BopModel[] {
    const filterValue = value ? value.toLowerCase() : '';
    const themes = this.searchForm.controls['theme'].value as string[];

    let filterGeo = this.bop.filter((option) => {
      if (themes) {
        return (
          option.label_theme != null &&
          themes.includes(option.label_theme) &&
          option.label?.toLowerCase().includes(filterValue)
        );
      }
      return (
        option.label?.toLowerCase().includes(filterValue) ||
        option.code.startsWith(filterValue)
      );
    });

    const controlBop = this.searchForm.controls['bops'].value as BopModel[];

    if (controlBop) {
      // si des BOPs sont déjà sélectionné
      return [
        ...controlBop,
        ...filterGeo.filter(
          (element) =>
            controlBop.findIndex(
              (valueSelected: BopModel) => valueSelected.code === element.code
            ) === -1 // on retire les doublons éventuels
        ),
      ];
    } else {
      return filterGeo;
    }
  }

  public generateArrayOfYears() {
    const max_year = new Date().getFullYear();
    let arr = Array(8).fill(new Date().getFullYear());
    arr = arr.map((_val, index) => max_year - index);
    return arr;
  }

  /** Applique les filtres selectionnés au préalable*/
  private _apply_prefilters(preFilter?: PreFilters) {
    if (preFilter == null)
      return

    this.searchForm.controls['location'].setValue(preFilter.location);

    if (preFilter.year) {
      let years = Array.isArray(preFilter.year) ? preFilter.year : [preFilter.year];
      let choices = this.generateArrayOfYears();
      if (!this._isArrayIncluded(years, choices))
        throw Error(`Vous devez selectionner des années comprises entrer ${choices[choices.length - 1]} et ${choices[0]}`);

      this.searchForm.controls['year'].setValue(
        Array.isArray(preFilter.year)
          ? preFilter.year
          : [preFilter.year]
      );
    }

    if (preFilter.theme) {
      const preFilterTheme = Array.isArray(preFilter.theme)
        ? (preFilter.theme as unknown as string[])
        : ([preFilter.theme] as unknown as string[]);
      const themeSelected = this.themes?.filter(
        (theme) =>
          preFilterTheme.findIndex(
            (themeFilter) =>  themeFilter  === theme
          ) !== -1
      );
      this.searchForm.controls['theme'].setValue(themeSelected);
    }

    this.searchForm.controls['beneficiaire'].setValue(
      preFilter.beneficiaire ?? null
    );

    // Application du bops
    // Il faut rechercher dans les filtres "this.filteredBop"
    if (preFilter.bops) {
      const prefilterBops = preFilter.bops as unknown as BopModel[];
      const bopSelect = this.filteredBop?.filter(
        (bop) =>
          prefilterBops.findIndex(
            (bopFilter) => bop.code === bopFilter.code
          ) !== -1
      );
      this.searchForm.controls['bops'].setValue(bopSelect);
    }

    /* Paramètres additionnels qui n'apparaissent pas dans le formulaire de recherche */
    let additional_searchparams: AdditionalSearchParameters = empty_additional_searchparams;

    let domaines_fonctionnels = preFilter?.domaines_fonctionnels
    if (domaines_fonctionnels)
      additional_searchparams = { ...additional_searchparams, domaines_fonctionnels }

    let referentiels_programmation = preFilter?.referentiels_programmation
    if (referentiels_programmation)
      additional_searchparams = { ...additional_searchparams, referentiels_programmation }

    let sources_region = preFilter?.sources_region;
    if (sources_region)
      additional_searchparams = { ...additional_searchparams, sources_region }
    
    let beneficiaires = preFilter?.marqueblanche_beneficiaires;
    if (beneficiaires)
      additional_searchparams = { ...additional_searchparams, beneficiaires }
    
    this.additional_searchparams = additional_searchparams;

    // lance la recherche pour afficher les resultats
    this.doSearch();
  }

  //region: Fonctions utilitaires

  private _isArrayIncluded(a1: number[], a2: number[]): boolean {
    return a1.every((num) => a2.includes(num));
  }

  //endregion
}
