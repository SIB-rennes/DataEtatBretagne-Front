import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'apps/common-lib/src/public-api';
import {
  JSONObject,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import {
  BehaviorSubject,
  debounceTime,
  finalize,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { SousAxePlanRelance } from '../models/axe.models';
import { Laureats } from '../models/laureat.models';
import { Structure } from '../models/structure.models';
import { Territoire } from '../models/territoire.models';
import { FranceRelanceHttpService } from '../services/france-relance.http.service';

@Component({
  selector: 'france-relance-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit, OnChanges {
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  /**
   * Resultats de la recherche.
   */
  @Output() searchResults = new EventEmitter<any>();

  /**
   * Resultats de la recherche.
   */
  @Output() currentFilter = new EventEmitter<Preference>();

  @Input()
  preFilter: JSONObject | null = null;

  public searchForm!: FormGroup;

  public filteredTerritoire: Observable<Territoire[]> | null | undefined;

  public filteredLaureat: Observable<Structure[]> | null | undefined;

  /**
   * Indique si la recherche est en cours
   */
  public searchInProgress = new BehaviorSubject(false);

  /**
   * Indique si la recherche a été effectué
   */
  public searchFinish = false;

  public axe_plan_relance: SousAxePlanRelance[] = [];

  @ViewChild('filterTerritoireInput')
  filterTerritoireInput!: ElementRef<HTMLInputElement>;

  public constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private service: FranceRelanceHttpService
  ) {}

  /**
   * Applique le filtre par défaut
   * @param _changes
   */
  ngOnChanges(_changes: SimpleChanges): void {
    if (this.preFilter !== null) {
      if (this.preFilter['territoire']) {
        (this.preFilter['territoire'] as Array<unknown>).forEach(
          (territoire) => {
            this.territoireControls.push(new FormControl(territoire));
          }
        );
      }

      if (this.preFilter['axe_plan_relance']) {
        const preFilterAxe = Array.isArray(this.preFilter['axe_plan_relance'])
          ? (this.preFilter[
              'axe_plan_relance'
            ] as unknown as SousAxePlanRelance[])
          : ([
              this.preFilter['axe_plan_relance'],
            ] as unknown as SousAxePlanRelance[]);
        const axeSelected = this.axe_plan_relance.filter(
          (axe) =>
            preFilterAxe.findIndex(
              (preFilterAxe) =>
                preFilterAxe.axe === axe.axe && preFilterAxe.label === axe.label
            ) !== -1
        );
        this.searchForm.controls['axe_plan_relance'].setValue(axeSelected);
      }

      this.searchForm.controls['structure'].setValue(
        this.preFilter['structure'] ?? null
      );

      // lance la recherche pour afficher les resultats
      this.doSearch();
    }
  }

  ngOnInit(): void {
    // récupération des themes dans le resolver
    this.route.data.subscribe(
      (response: { axes: SousAxePlanRelance[] | Error } | any) => {
        this.axe_plan_relance = response.axes;
      }
    );
    this._initForm();
  }

  public cancelAxe(): void {
    this.searchForm.controls['axe_plan_relance'].setValue(null);
  }

  public get axePlanDeRelanceControls(): FormControl {
    return this.searchForm.controls['axe_plan_relance'] as FormControl;
  }

  public doSearch(): void {
    this.searchForm.markAllAsTouched(); // pour notifier les erreurs sur le formulaire
    if (this.searchForm.valid && !this.searchInProgress.value) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      this.service
        .searchFranceRelance(
          formValue.axe_plan_relance,
          formValue.structure,
          formValue.territoire
        )
        .pipe(
          finalize(() => {
            this.searchInProgress.next(false);
          })
        )
        .subscribe({
          next: (response: Laureats[] | Error) => {
            this.searchFinish = true;
            this.currentFilter.next(this._buildPreference(formValue));
            this.searchResults.next(response);
          },
          error: (err: Error) => {
            this.searchFinish = true;
            this.currentFilter.next(this._buildPreference(formValue));
            this.searchResults.next([]);
            this.alertService.openAlertError(err.message, 8);
          },
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
        (object[key] !== null &&
          object[key] !== undefined &&
          object[key] !== '' &&
          !Array.isArray(object[key])) ||
        (Array.isArray(object[key]) &&
          (object[key] as Array<unknown>).length > 0)
      ) {
        preference.filters[key] = object[key];
      }
    });
    return preference;
  }

  public downloadCsv(): void {
    if (this.searchForm.valid && !this.searchInProgress.value) {
      const formValue = this.searchForm.value;
      this.searchInProgress.next(true);
      this.service
        .getCsv(
          formValue.axe_plan_relance,
          formValue.structure,
          formValue.territoire
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
          a.download = 'export_csv.csv';
          document.body.appendChild(a);
          a.click();
        });
    }
  }

  public reset(): void {
    this.searchFinish = false;
    this.searchForm.reset();
  }

  public addTerritoire(event: MatAutocompleteSelectedEvent): void {
    this.territoireControls.push(new FormControl(event.option.value));
    this.filterTerritoireInput.nativeElement.value = '';

    this.searchForm.controls['filterTerritoire'].setValue('');
  }

  get territoireControls(): FormArray {
    return this.searchForm.controls['territoire'] as FormArray;
  }

  public removeTerritoire(event: any): void {
    const index = this.territoireControls.value.indexOf(event);
    if (index >= 0) {
      this.territoireControls.removeAt(index);
    }
  }

  public onSelectLaureat(event: Structure): void {}

  public displayLaureat(laureat: Structure): string {
    if (laureat) return laureat.label + ' - ' + laureat.siret;
    return '';
  }

  private _initForm(): void {
    this.searchForm = new FormGroup({
      territoire: new FormArray([]),
      axe_plan_relance: new FormControl(null),
      structure: new FormControl(null),
      filterTerritoire: new FormControl(null), // pour le filtre des territoires
    });

    // filtre beneficiaire
    this.filteredTerritoire = this.searchForm.controls[
      'filterTerritoire'
    ].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        if (value && value.length > 3) {
          return this.service.searchTerritoire(value);
        }
        return of([]);
      })
    );

    // filtre laureat
    this.filteredLaureat = this.searchForm.controls[
      'structure'
    ].valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((value) => {
        if (value && value.length > 3) {
          return this.service.searchStructure(value);
        }
        return of([]);
      })
    );
  }
}
