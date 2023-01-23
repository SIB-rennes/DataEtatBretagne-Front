import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, Observable, of, startWith, switchMap } from 'rxjs';
import { GeoModel, TypeLocalisation } from '../../models/geo.models';
import { GeoHttpService } from '../../services/geo-http.service';

@Component({
  selector: 'lib-localisation',
  templateUrl: './localisation.component.html',
  styles: [
    `
      .location {
        margin-left: 6px;
      }
    `,
  ],
})
export class LocalisationComponent {
  public category: TypeLocalisation | undefined;

  public readonly TypeLocalisation = Object.values(TypeLocalisation);

  @Input()
  control!: FormControl<any>;

  public filterGeo: Observable<GeoModel[]> | null | undefined = null;

  public categorySelected: TypeLocalisation | null = null;

  constructor(private geoService: GeoHttpService) {}

  /**
   * Affiche le nom du departement une fois sélectionné
   * @param departement
   * @returns
   */
  public displayGeo(geo: any): string {
    if (geo) {
      return geo.nom;
    }
    return '';
  }

  public selectedCategory(event: any) {
    this.categorySelected = event.value;

    if (this.categorySelected != null) {
      this.control.enable();
      this.control.setValue(null);
      this.filterGeo = this.control.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        switchMap((value) => {
          if (this.categorySelected && value && value.length > 1) {
            switch (this.categorySelected) {
              case TypeLocalisation.DEPARTEMENT:
                return this.geoService.filterDepartement(value);
              case TypeLocalisation.COMMUNE:
                return this.geoService.filterCommune(value);
              case TypeLocalisation.EPCI:
                return this.geoService.filterEpci(value);
            }
          }

          return of([]);
        })
      );
    }
  }
}
