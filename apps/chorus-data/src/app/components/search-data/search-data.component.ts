import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  switchMap,
  of,
  startWith,
  Observable,
  debounceTime,
  Subject,
  tap,
  finalize,
} from 'rxjs';
import { BopModel } from '../../models/bop.models';
import { GeoDepartementModel } from '../../models/geo.models';
import { ChorusHttpService } from '../../services/chorus-http.service';
import { GeoHttpService } from '../../services/geo-http.service';

@Component({
  selector: 'chorus-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
  public searchForm!: FormGroup;

  public filterDepartement:
    | Observable<GeoDepartementModel[]>
    | null
    | undefined = null;

  public filterBop: BopModel[] = [];

  public isLoading: boolean | undefined;

  constructor(
    private geoService: GeoHttpService,
    private chorusService: ChorusHttpService
  ) {}

  ngOnInit(): void {
    this.isLoading = false;
    this.searchForm = new FormGroup({
      year: new FormControl('', {
        validators: [
          Validators.min(2011),
          Validators.max(new Date().getFullYear()),
        ],
      }),
      bop: new FormControl(''),
      departement: new FormControl(''),
    });

    this.searchForm.controls['bop'].valueChanges
      .pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap((value) => {
          if (value && value.length > 2) {
            return this.chorusService
              .filterBop(value)
              .pipe(finalize(() => (this.isLoading = false)));
          } else {
            return of([]).pipe(finalize(() => (this.isLoading = false)));
          }
        })
      )
      .subscribe((bops) => (this.filterBop = bops));

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
}
