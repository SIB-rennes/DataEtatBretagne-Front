import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  JSONObject,
  MapPreferenceFilterMetadata,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';

@Component({
  selector: 'financial-preference',
  templateUrl: './preference.component.html',
})
export class PreferenceComponent {
  constructor(private router: Router) {}

  public mappingValueFilter: MapPreferenceFilterMetadata = {
    bops: {
      label: 'Programmes',
      renderFn: (row: JSONObject) => row['code'] + ' - ' + row['label'],
    },
    year: {
      label: 'Année'
    },
    theme: {
      label: 'Thème'
    },
    beneficiaire: {
      label: 'Bénéficiare',
      renderFn: (row: JSONObject) => {
        if (row['denomination']) {
          return `${row['denomination']} (${row['siret']})`;
        }
        return `Siret : (${row['siret']})`;
      },
    },
    location: {
      label: 'Territoire',
      renderFn: (row: JSONObject) => {
        return `${row['type']} : ${row['nom']} (${row['code']})`;
      },
    },
  };

  /**
   * redirige vers la page d'accueil avec l'identifiant du filtre
   *
   * @param uuid
   * @param _pref
   */
  public applyPreference = (uuid: string, _pref: Preference) => {
    this.router.navigate([''], {
      queryParams: { uuid: uuid },
    });
  };
}
