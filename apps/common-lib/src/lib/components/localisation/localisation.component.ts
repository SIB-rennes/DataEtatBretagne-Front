import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

export enum TypeLocalisation {
  DEPARTEMENT = 'Département',
  EPCI = 'Epci',
  COMMUNE = 'Commune',
}

@Component({
  selector: 'lib-localisation',
  templateUrl: './localisation.component.html',
})
export class LocalisationComponent {
  public category: TypeLocalisation | undefined;

  public readonly TypeLocalisation = Object.values(TypeLocalisation);

  @Input()
  control!: FormControl<any>;

  public selectedCategory(event: any) {
    console.log(event);
  }

  /**
   * Affiche le nom du departement une fois sélectionné
   * @param departement
   * @returns
   */
  public displayDepartement(departement: any): string {
    if (departement) {
      return departement.nom;
    }
    return '';
  }
}
