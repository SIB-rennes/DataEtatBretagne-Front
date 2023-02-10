import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import {
  JSONObject,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import {
  BehaviorSubject,
  debounceTime,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { SousAxePlanRelance } from '../models/axe.models';
import { Territoire } from '../models/territoire.models';
import { FranceRelanceHttpService } from '../services/france-relance.http.service';

@Component({
  selector: 'france-relance-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
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
    private service: FranceRelanceHttpService
  ) {}

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
      console.log(formValue);
      //this.searchInProgress.next(true);
      this.service
        .searchFranceRelance(formValue.axe_plan_relance)
        .subscribe((response) => {
          console.log(response);
        });
    }
  }

  public downloadCsv(): void {}

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
  }
}
