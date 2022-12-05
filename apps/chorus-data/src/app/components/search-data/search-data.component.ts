import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of, startWith, Observable, map } from 'rxjs';
import { BopModel } from '../../models/bop.models';
import { ChorusResolverModel } from '../../models/chorus-resolvers.models';
import { GeoDepartementModel } from '../../models/geo.models';
import { RefTheme } from '../../models/theme.models';
import { ChorusHttpService } from '../../services/chorus-http.service';
import { GeoHttpService } from '../../services/geo-http.service';
import { chorusFormValidators } from '../../validators/chorus-form.validators';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective): boolean {
    if (control == null || form.invalid == null || form.errors == null)
      return false;

    return control.touched && form.errors['bopRequired'];
  }
}

@Component({
  selector: 'chorus-search-data',
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

  constructor(
    private geoService: GeoHttpService,
    private route: ActivatedRoute,
    private service: ChorusHttpService
  ) {}

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
      (response: { chorus: ChorusResolverModel } | any) => {
        this.themes = response.chorus.themes;
        this.bop = response.chorus.bop;
        this.filteredTheme = of(this.themes);
        this.filteredBop = of(this.bop);
      }
    );

    this._onFilter();
  }

  public displayDepartement(departement: GeoDepartementModel): string {
    if (departement) {
      return departement.nom;
    }
    return '';
  }

  public displayBop(bop: BopModel): string {
    if (bop) {
      return bop.Label;
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
    this.filteredBop = of(
      this.bop.filter((option) => {
        if (option.RefTheme) {
          return option.RefTheme.Id === value.Id;
        }
        return false;
      })
    );
  }

  public onSelectBop(value: BopModel): void {
    this.searchForm.controls['bop'].setValue(value);
  }

  public displayTheme(theme: RefTheme): string {
    if (theme) {
      return theme.Label;
    }
    return '';
  }

  public get departementControls(): FormControl | null {
    return this.searchForm.get('departement') as FormControl;
  }

  public get errorsBop(): ValidationErrors | null {
    return this.searchForm.errors != null
      ? this.searchForm.errors['bopRequired']
      : null;
  }

  /**
   * lance la recherche des lignes chorus
   */
  public searchChorus(): void {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      this.service
        .filterChorus(
          formValue.bop,
          formValue.theme,
          formValue.year,
          formValue.departement
        )
        .subscribe((response) => {
          console.log(response);
        });
    } else {
      console.log(
        this.searchForm.errors != null
          ? this.searchForm.errors['bopRequired']
          : 'oups'
      );
    }
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
            Validators.min(2011),
            Validators.max(new Date().getFullYear()),
          ],
        }),
        bop: new FormControl(null),
        theme: new FormControl(null),
        departement: new FormControl(null, [Validators.required]),
      },
      chorusFormValidators()
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
}
