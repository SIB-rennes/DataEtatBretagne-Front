import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  JSONObject,
  MapPreferenceFilterMetadata,
  Preference,
} from 'apps/preference-users/src/lib/models/preference.models';

@Component({
  selector: 'france-relance-preference',
  templateUrl: './preference.component.html',
})
export class PreferenceComponent {
  constructor(private router: Router) {}

  public mappingValueFilter: MapPreferenceFilterMetadata = {
    structure: {
      label: 'Lauréat',
      renderFn: (row: JSONObject) => row['label'],
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
