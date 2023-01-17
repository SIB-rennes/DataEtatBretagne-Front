import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import {
  switchMap,
  of,
  startWith,
  Observable,
  map,
  finalize,
  BehaviorSubject,
  debounceTime,
} from 'rxjs';
import { BopModel } from '@models//bop.models';
import { FinancialDataResolverModel } from '@models/financial-data-resolvers.models';
import { GeoDepartementModel } from '@models//geo.models';
import { RefTheme } from '@models//theme.models';
import { FinancialDataHttpService } from '../../services/financial-data-http.service';
import { GeoHttpService } from '../../services/geo-http.service';
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

type BopModelSelected = BopModel & { selected: boolean };

@Component({
  selector: 'financial-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit, AfterViewInit {
  public searchForm!: FormGroup;

  public errorMatcher = new CrossFieldErrorMatcher();

  public filterDepartement:
    | Observable<GeoDepartementModel[]>
    | null
    | undefined = null;

  public bop: BopModelSelected[] = [];
  public themes: RefTheme[] = [];

  public filteredTheme: Observable<RefTheme[]> | null | undefined = null;
  public filteredBeneficiaire: Observable<RefSiret[]> | null | undefined = null;
  public filteredBop: BopModelSelected[] | undefined = undefined;

  @ViewChild('autoCompleteThemeInput', {
    static: false,
    read: MatAutocompleteTrigger,
  })
  public triggerTheme: MatAutocompleteTrigger | undefined;

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
  @Output() filter = new EventEmitter<Preference>();

  constructor(
    private geoService: GeoHttpService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private service: FinancialDataHttpService
  ) {}

  ngAfterViewInit() {
    if (this.triggerTheme) {
      this.triggerTheme.panelClosingActions.subscribe((e) => {
        this.searchForm.controls['theme'].setValue(null);
        this.searchForm.controls['filterBop'].setValue('');
      });
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
          this.bop.map((bop) => {
            return { ...bop, selected: false };
          });

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
   * Affiche le nom du departement une fois sélectionné
   * @param departement
   * @returns
   */
  public displayDepartement(departement: GeoDepartementModel): string {
    if (departement) {
      return departement.nom;
    }
    return '';
  }

  /**
   * Set la valeur au bon formControl pour les mat autocomplete
   * @param value
   * @param controls
   */
  public onSelectTheme(theme: RefTheme): void {
    this.searchForm.controls['theme'].setValue(theme);
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
   * Retourne le FormControl du departement
   */
  public get departementControls(): FormControl | null {
    return this.searchForm.get('departement') as FormControl;
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
          formValue.departement
        )
        .pipe(
          finalize(() => {
            this.searchInProgress.next(false);
          })
        )
        .subscribe((response: FinancialDataModel[]) => {
          this.searchFinish = true;
          this.filter.next(this._buildPreference(formValue));
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
          formValue.departement
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
      formValue.departement.nom
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
        departement: new FormControl(null, [Validators.required]),
      },
      financialDataFormValidators()
    );

    // Filtre sur le theme
    this.filteredTheme = this.searchForm.controls['theme'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (typeof value === 'string') {
          return this._filterTheme(value ? value : '');
        } else {
          return this._filterTheme(value ? value?.Label : '');
        }
      })
    );

    this.searchForm.controls['filterBop'].valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.filteredBop = this._filterBop(value ? value : '');
      } else {
        this.filteredBop = this._filterBop(value ? value?.Label : '');
      }
    });

    // filtre departement
    this.filterDepartement = this.searchForm.controls[
      'departement'
    ].valueChanges.pipe(
      startWith(''),
      switchMap((value) => {
        if (value && value.length > 1) {
          return this.geoService.filterDepartement(value);
        }
        return of([]);
      })
    );

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

  private _filterTheme(value: string): RefTheme[] {
    const filterValue = value.toLowerCase();
    return this.themes.filter((option) =>
      option.Label.toLowerCase().includes(filterValue)
    );
  }

  private _filterBop(value: string): BopModelSelected[] {
    const filterValue = value ? value.toLowerCase() : '';
    const theme = this.searchForm.controls['theme'].value as RefTheme;
    return this.bop.filter((option) => {
      if (theme && option.RefTheme) {
        return (
          option.RefTheme.Id === theme.Id &&
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
