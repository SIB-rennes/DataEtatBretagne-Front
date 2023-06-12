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
import { FinancialDataResolverModel } from '@models/financial/financial-data-resolvers.models';
import { RefTheme } from '@models/refs/theme.models';
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
  TypeLocalisation,
} from 'apps/common-lib/src/public-api';
import { Bop } from '@models/search/bop.model';
import { Theme } from '@models/search/theme.model';
import { Beneficiaire } from '@models/search/beneficiaire.model';
import { BudgetService } from '@services/budget.service';
import { NGXLogger } from 'ngx-logger';
import { PreFilters } from '@models/search/prefilters.model';
import { MarqueBlancheParsedParamsResolverModel } from '../../resolvers/marqueblanche-parsed-params.resolver';


@Component({
  selector: 'financial-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
  public readonly TypeLocalisation = TypeLocalisation;
  public searchForm!: FormGroup;

  public bop: BopModel[] = [];
  public themes: RefTheme[] = [];

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
      theme: new FormControl<Theme | null>(null),
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

        let financial = response.financial.data!;

        let mb_prefilter = response.mb_parsed_params?.data?.preFilters;
        let mb_has_params = response.mb_parsed_params?.data?.has_marqueblanche_params;

        this.displayError = false;
        this.themes = financial.themes;
        this.bop = financial.bop;

        this.filteredBop = this.bop;

        if (mb_has_params && mb_prefilter) {
          this.logger.debug(`Mode marque blanche. On applique les filtres demandés.`);
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
    let code = element?.Code;
    let nom = element?.Denomination;

    if (code && nom) {
      return `${nom} (${code})`;
    } else if (code) {
      return code;
    } else {
      return nom;
    }
  }

  /**
   * Fonction utile pour afficher le theme ou un bop
   * @param theme
   * @returns
   */
  public displayTheme(element: RefTheme): string {
    if (element) {
      return element.Label;
    }
    return '';
  }

  /**
   *
   */
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
    this._search_subscription = this.budgetService
      .search(
        formValue.beneficiaire,
        formValue.bops,
        formValue.theme,
        formValue.year,
        formValue.location
      )
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
          .filter((bop) => bop.Code)
          .map((bop) => bop.Code)
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
    const themes = this.searchForm.controls['theme'].value as RefTheme[];
    const themesId = themes ? themes.map((t) => t.Id) : null;

    let filterGeo = this.bop.filter((option) => {
      if (themesId) {
        return (
          option.RefTheme != null &&
          themesId.includes(option.RefTheme.Id) &&
          option.Label?.toLowerCase().includes(filterValue)
        );
      }
      return (
        option.Label?.toLowerCase().includes(filterValue) ||
        option.Code.startsWith(filterValue)
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
              (valueSelected: BopModel) => valueSelected.Code === element.Code
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
        ? (preFilter.theme as unknown as RefTheme[])
        : ([preFilter.theme] as unknown as RefTheme[]);
      const themeSelected = this.themes?.filter(
        (theme) =>
          preFilterTheme.findIndex(
            (themeFilter) => themeFilter.Id === theme.Id
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
            (bopFilter) => bop.Code === bopFilter.Code
          ) !== -1
      );
      this.searchForm.controls['bops'].setValue(bopSelect);
    }
    // lance la recherche pour afficher les resultats
    this.doSearch();
  }

  //region: Fonctions utilitaires

  private _isArrayIncluded(a1: number[], a2: number[]): boolean {
    return a1.every((num) => a2.includes(num));
  }

  //endregion
}
