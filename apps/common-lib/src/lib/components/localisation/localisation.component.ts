import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { FormControl } from '@angular/forms';
import { debounceTime, Observable, Subject } from 'rxjs';
import { GeoModel, TypeLocalisation } from '../../models/geo.models';
import { GeoHttpService } from '../../services/geo-http.service';

@Component({
  selector: 'lib-localisation',
  standalone: true,
  templateUrl: './localisation.component.html',
  imports: [
    MatSelectModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      .location {
        margin-left: 6px;
      }
    `,
    `
      .field-100-width {
        width: 100%;
      }
    `,
  ],
})
export class LocalisationComponent implements OnChanges, OnInit {
  public category: TypeLocalisation | undefined;

  public readonly TypeLocalisation = Object.values(TypeLocalisation);

  public searchGeoChanged = new Subject<string>();

  @Input()
  control!: FormControl<any>;

  public filteredGeo: GeoModel[] | undefined = undefined;

  public searchGeo: string = '';

  @Input()
  public categorySelected: TypeLocalisation | null = null;

  constructor(private geoService: GeoHttpService) {
    this.searchGeoChanged.pipe(debounceTime(300)).subscribe(() => {
      this._search();
    });
  }

  ngOnInit(): void {
    if (this.categorySelected === null) {
      this.categorySelected = TypeLocalisation.DEPARTEMENT;
    }
    this._search();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.control.value) {
      this._search();
    }
  }

  public changeSearchGeo(): void {
    this.searchGeoChanged.next(this.searchGeo);
  }

  /**
   *  A la selection d'une categorie de territoire, enable le champ et récupère les values associés
   * @param event
   */
  public selectedCategory(event: any) {
    this.categorySelected = event.value;

    if (this.categorySelected != null) {
      this.control.setValue(null);
      this.searchGeo = '';
      this._filterGeo(null, this.categorySelected).subscribe(
        (response) => (this.filteredGeo = response)
      );
    }
  }

  /**
   * Lance la recherche sur le champ Controls quand l'utilisateur saisie une donnée au clavier
   */
  private _search() {
    if (this.categorySelected != null) {
      this._filterGeo(this.searchGeo, this.categorySelected).subscribe(
        (response: GeoModel[]) => {
          if (this.control.value) {
            // pour ne pas perdre la sélection au filtre, on conserve les valeurs du controls.
            this.filteredGeo = [
              ...this.control.value,
              ...response.filter(
                (element) =>
                  this.control.value.findIndex(
                    (valueSelected: GeoModel) =>
                      valueSelected.code === element.code
                  ) === -1 // on retire les doublons éventuels
              ),
            ];
          } else {
            this.filteredGeo = response;
          }
        }
      );
    }
  }

  private _filterGeo(
    value: string | null,
    type: TypeLocalisation
  ): Observable<GeoModel[]> {
    switch (type) {
      case TypeLocalisation.DEPARTEMENT:
        return this.geoService.filterDepartement(value);
      case TypeLocalisation.COMMUNE:
        return this.geoService.filterCommune(value);
      case TypeLocalisation.EPCI:
        return this.geoService.filterEpci(value);
      case TypeLocalisation.CRTE:
        return this.geoService.filterCrte(value);
    }
  }
}