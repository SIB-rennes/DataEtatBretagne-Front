import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  JSONObject,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';
import { BehaviorSubject } from 'rxjs';
import { SousAxePlanRelance } from '../models/axe.models';
import { FranceRelanceHttpService } from '../services/france-relance.http.service';

@Component({
  selector: 'france-relance-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
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

  /**
   * Indique si la recherche est en cours
   */
  public searchInProgress = new BehaviorSubject(false);

  /**
   * Indique si la recherche a été effectué
   */
  public searchFinish = false;

  public axe_plan_relance: SousAxePlanRelance[] = [];

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

  private _initForm(): void {
    this.searchForm = new FormGroup({
      localisation: new FormControl(null),
      axe_plan_relance: new FormControl(null),
      structure: new FormControl(null),
    });
  }
}
