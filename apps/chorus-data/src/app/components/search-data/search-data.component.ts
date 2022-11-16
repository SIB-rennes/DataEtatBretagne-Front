import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, map, of, startWith, Observable } from 'rxjs';
import { GeoHttpService } from '../../services/geo-http.service';

@Component({
  selector: 'chorus-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.scss'],
})
export class SearchDataComponent implements OnInit {
  public searchForm!: FormGroup;
  public codeBop = [
    { code: 127, libelle: 'lib 127' },
    { code: 157, libelle: 'lib 128' },
  ];

  public filterDepartement: Observable<Object[]> | null | undefined = null;

  constructor(private geoService: GeoHttpService) {}

  ngOnInit(): void {
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

    // this.searchForm.controls['departement'].valueChanges.subscribe((value) => {
    //   console.log('form value changed');
    //   console.log(value);

    // });
    this.filterDepartement = this.searchForm.controls[
      'departement'
    ].valueChanges.pipe(
      switchMap((value) => {
        if (value && value.length > 3) {
          return this.geoService.filterDepartement(value);
        }
        return of([]);
      })
    );
  }
}
