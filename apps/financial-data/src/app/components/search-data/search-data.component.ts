import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  switchMap,
  of,
  startWith,
  Observable,
  finalize,
  BehaviorSubject,
  debounceTime,
} from 'rxjs';
import { BopModel } from '@models//bop.models';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { RefTheme } from '@models//theme.models';
import { FinancialDataHttpService } from '../../services/financial-data-http.service';
import {
  CrossFieldErrorMatcher,
  financialDataFormValidators,
} from '../../validators/financial-data-form.validators';
import { FinancialDataModel } from '@models/financial-data.models';
import { DatePipe } from '@angular/common';
import { RefSiret } from '@models/RefSiret';
import {
  JSONObject,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import { TypeLocalisation } from 'apps/common-lib/src/public-api';

@Component({
  selector: 'financial-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit, OnChanges {
  public readonly TypeLocalisation = TypeLocalisation;
  public searchForm!: FormGroup;

  public errorMatcher = new CrossFieldErrorMatcher();

  public bop: BopModel[] = [];
  public themes: RefTheme[] = [];

  public filteredTheme: Observable<RefTheme[]> | null | undefined = null;
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
  public error: Error | null = null;

  /**
   * Resultats de la recherche.
   */
  @Output() searchResults = new EventEmitter<FinancialDataModel[]>();

  /**
   * Resultats de la recherche.
   */
  @Output() currentFilter = new EventEmitter<Preference>();

  @Input()
  preFilter: JSONObject | null = null;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private service: FinancialDataHttpService
  ) {}

  /**
   * Applique le filtre par défaut
   * @param _changes
   */
  ngOnChanges(_changes: SimpleChanges): void {
    if (this.preFilter !== null) {
      this.searchForm.controls['location'].setValue(this.preFilter['location']);
      this.searchForm.controls['year'].setValue(
        Array.isArray(this.preFilter['year'])
          ? this.preFilter['year']
          : [this.preFilter['year']]
      );
      this.searchForm.controls['theme'].setValue(
        this.preFilter['theme'] ?? null
      );
      this.searchForm.controls['beneficiaire'].setValue(
        this.preFilter['beneficiaire'] ?? null
      );

      // Application du bops
      // Il faut rechercher dans les filtres "this.filteredBop"
      if (this.preFilter['bops']) {
        const prefilterBops = this.preFilter['bops'] as unknown as BopModel[];
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
  }

  ngOnInit(): void {
    // récupération des themes dans le resolver
    this.route.data.subscribe(
      (response: { financial: FinancialDataResolverModel | Error } | any) => {
        if ('themes' in response.financial) {
          this.displayError = false;
          this.themes = response.financial.themes;
          this.bop = response.financial.bop;

          this.filteredTheme = of(this.themes);
          this.filteredBop = this.bop;
        } else {
          this.displayError = true;
          this.error = response.financial as Error;
        }
      }
    );
    this._onFilter();
  }

  /**
   * Change la valeur du bop pour déclencher une nouvelle recherche de BOP associé aux themes
   */
  public onSelectTheme(_event: any): void {
    this.searchForm.controls['filterBop'].setValue('');
    this.searchForm.controls['bops'].setValue(null);
  }

  /**
   * Action déclenché quand on annule le theme
   */
  public cancelTheme(): void {
    this.searchForm.controls['theme'].setValue(null);
    this.searchForm.controls['filterBop'].setValue('');
    this.searchForm.controls['bops'].setValue(null);
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
  public doSearch(): void {
    this.searchForm.markAllAsTouched(); // pour notifier les erreurs sur le formulaire
    if (this.searchForm.valid && !this.searchInProgress.value) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      this.service
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
        .subscribe((response: FinancialDataModel[]) => {
          this.searchFinish = true;
          this.currentFilter.next(this._buildPreference(formValue));
          this.searchResults.next(response);
        });
    }
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
    if (this.searchForm.valid && !this.searchInProgress.value) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      this.service
        .getCsv(
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
        .subscribe((response: Blob) => {
          var url = URL.createObjectURL(response);
          var a = document.createElement('a');
          a.href = url;
          a.download = this._filenameCsv();
          document.body.appendChild(a);
          a.click();
        });
    }
  }

  public reset(): void {
    this.searchFinish = false;
    this.searchForm.reset();
  }

  private _filenameCsv(): string {
    const formValue = this.searchForm.value;
    let filename = `${this.datePipe.transform(new Date(), 'yyyyMMdd')}_export_${
      formValue.location.nom
    }`;

    if (formValue.theme !== null) {
      filename += '_' + formValue.theme.Label;
    }
    if (formValue.bops !== null) {
      const bops = formValue.bops as BopModel[];
      filename +=
        '_' +
        bops
          .filter((bop) => bop.Code)
          .map((bop) => bop.Code)
          .join('-');
    }

    if (formValue.year) {
      filename += '_' + formValue.year;
    }

    return filename + '.csv';
  }

  /**
   * filtrage des données des formulaires pour les autocomplete
   */
  private _onFilter(): void {
    // formulaire
    this.searchForm = new FormGroup(
      {
        year: new FormControl('', {
          validators: [
            Validators.min(2000),
            Validators.max(new Date().getFullYear()),
          ],
        }),
        bops: new FormControl(null),
        theme: new FormControl(null),
        beneficiaire: new FormControl(null),
        filterBop: new FormControl(null), // controls pour le filtre des bops
        location: new FormControl({ value: null, disabled: false }, [
          Validators.required,
        ]),
      },
      financialDataFormValidators()
    );

    this.searchForm.controls['filterBop'].valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.filteredBop = this._filterBop(value ? value : '');
      } else {
        this.filteredBop = this._filterBop(value ? value?.Label : '');
      }
    });

    // filtre beneficiaire
    this.filteredBeneficiaire = this.searchForm.controls[
      'beneficiaire'
    ].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        if (value && value.length > 3) {
          return this.service.filterRefSiret(value);
        }
        return of([]);
      })
    );
  }

  private _filterBop(value: string): BopModel[] {
    const filterValue = value ? value.toLowerCase() : '';
    const themes = this.searchForm.controls['theme'].value as RefTheme[];
    const themesId = themes ? themes.map((t) => t.Id) : null;

    return this.bop.filter((option) => {
      if (themesId && option.RefTheme) {
        return (
          themesId.includes(option.RefTheme.Id) &&
          option.Label?.toLowerCase().includes(filterValue)
        );
      }
      return (
        option.Label?.toLowerCase().includes(filterValue) ||
        option.Code.startsWith(filterValue)
      );
    });
  }

  public generateArrayOfYears() {
    const max_year = new Date().getFullYear();
    let arr = Array(8).fill(new Date().getFullYear());
    arr = arr.map((_val, index) => max_year - index);
    return arr;
  }
}
