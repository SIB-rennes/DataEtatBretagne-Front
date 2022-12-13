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

  public bop: BopModel[] = [];
  public themes: RefTheme[] = [];

  public filteredTheme: Observable<RefTheme[]> | null | undefined = null;
  public filteredBop: Observable<BopModel[]> | null | undefined = null;

  @ViewChild('autoCompleteThemeInput', {
    static: false,
    read: MatAutocompleteTrigger,
  })
  public triggerTheme: MatAutocompleteTrigger | undefined;

  @ViewChild('autoCompleteBopInput', {
    static: false,
    read: MatAutocompleteTrigger,
  })
  public triggerBop: MatAutocompleteTrigger | undefined;

  /**
   * Indique si la recherche est en cours
   */
  private searchInProgress = new BehaviorSubject(false);

  /**
   * Resultats de la recherche.
   */
  @Output() searchResults = new EventEmitter<FinancialDataModel[]>();

  @Output() searchInProgressChange = new EventEmitter<boolean>();

  constructor(
    private geoService: GeoHttpService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private service: FinancialDataHttpService
  ) {
    this.searchInProgress.subscribe((value) => {
      this.searchInProgressChange.next(value);
    });
  }

  ngAfterViewInit() {
    if (this.triggerTheme) {
      this.triggerTheme.panelClosingActions.subscribe((e) => {
        this.searchForm.controls['theme'].setValue(null);
      });
    }

    if (this.triggerBop) {
      this.triggerBop.panelClosingActions.subscribe((e) => {
        this.searchForm.controls['bop'].setValue(null);
      });
    }
  }

  ngOnInit(): void {
    // récupération des themes dans le resolver
    this.route.data.subscribe(
      (response: { financial: FinancialDataResolverModel } | any) => {
        this.themes = response.financial.themes;
        this.bop = response.financial.bop;
        this.filteredTheme = of(this.themes);
        this.filteredBop = of(this.bop);
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
  public onSelectTheme(value: RefTheme): void {
    this.searchForm.controls['theme'].setValue(value);
    this.searchForm.controls['bop'].setValue(null);
  }

  /**
   * Set la valeur du formControls bop quand on sélectionne une valeur dans l'auto complete
   * @param value
   */
  public onSelectBop(value: BopModel): void {
    this.searchForm.controls['bop'].setValue(value);
  }

  /**
   * Fonction utile pour afficher le theme ou un bop
   * @param theme
   * @returns
   */
  public displayThemeBop(element: RefTheme | BopModel): string {
    if (element) {
      return element.Label;
    }
    return '';
  }

  /**
   * Retourne le FormControl du departement
   */
  public get departementControls(): FormControl | null {
    return this.searchForm.get('departement') as FormControl;
  }

  /**
   * Retourne le ValidationErrors bopRequired
   */
  public get errorsBop(): ValidationErrors | null {
    return this.searchForm.errors != null
      ? this.searchForm.errors['bopRequired']
      : null;
  }

  /**
   * lance la recherche des lignes d'engagement financière
   */
  public doSearch(): void {
    if (this.searchForm.valid && !this.searchInProgress.value) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      this.service
        .search(
          formValue.bop,
          formValue.theme,
          formValue.year,
          formValue.departement
        )
        .pipe(
          finalize(() => {
            this.searchInProgress.next(false);
          })
        )
        .subscribe((response) => {
          this.searchResults.next(response);
        });
    }
  }

  public downloadCsv(): void {
    if (this.searchForm.valid && !this.searchInProgress.value) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      this.service
        .getCsv(
          formValue.bop,
          formValue.theme,
          formValue.year,
          formValue.departement
        )
        .subscribe((response: Blob) => {
          console.log(response);
          var url = URL.createObjectURL(response);
          var a = document.createElement('a');
          a.href = url;
          a.download = this._filenameCsv();
          document.body.appendChild(a);
          a.click();
        });
    }
  }

  private _filenameCsv(): string {
    const formValue = this.searchForm.value;
    let filename = `${this.datePipe.transform(new Date(), 'yyyyMMdd')}_export_${
      formValue.departement.nom
    }`;

    if (formValue.theme !== null) {
      filename += '_' + formValue.theme.Label;
    }
    if (formValue.bop !== null) {
      filename += '_' + formValue.bop.Label;
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
        bop: new FormControl(null),
        theme: new FormControl(null),
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
    // Filtre sur les bop
    this.filteredBop = this.searchForm.controls['bop'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (typeof value === 'string') {
          return this._filterBop(value ? value : '');
        } else {
          return this._filterBop(value ? value?.Label : '');
        }
      })
    );

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
  }

  private _filterTheme(value: string): RefTheme[] {
    const filterValue = value.toLowerCase();
    return this.themes.filter((option) =>
      option.Label.toLowerCase().includes(filterValue)
    );
  }

  private _filterBop(value: string): BopModel[] {
    const filterValue = value.toLowerCase();
    const theme = this.searchForm.controls['theme'].value as RefTheme;
    return this.bop.filter((option) => {
      if (theme && option.RefTheme) {
        return (
          option.RefTheme.Id === theme.Id &&
          option.Label?.toLowerCase().includes(filterValue)
        );
      }
      return option.Label?.toLowerCase().includes(filterValue);
    });
  }

  public generateArrayOfYears() {
    const max_year = new Date().getFullYear();
    let arr = Array(10).fill(new Date().getFullYear());
    arr = arr.map((_val, index) => max_year - index);
    return arr;
  }
}
