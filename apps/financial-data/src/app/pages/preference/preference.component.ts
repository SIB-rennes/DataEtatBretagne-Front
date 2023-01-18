import { JsonPipe } from '@angular/common';
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
      renderFn: (row: JSONObject) => row['Code'] + ' - ' + row['Label'],
    },
    year: {
      label: 'Année',
    },
    theme: {
      label: 'Thème',
      renderFn: (row: JSONObject) => row['Label'],
    },
    beneficiaire: {
      label: 'Bénéficiare',
      renderFn: (row: JSONObject) => {
        if (row['Denomination']) {
          return `${row['Denomination']} (${row['Code']})`;
        }
        return `Siret : (${row['Code']})`;
      },
    },
    departement: {
      label: 'Département',
      renderFn: (row: JSONObject) => {
        return `${row['nom']} (${row['code']})`;
      },
    },
  };

  public applyPreference = (_uuid: string, pref: Preference) => {
    this.router.navigate([''], {
      queryParams: { filter: JSON.stringify(pref.filters), name: pref.name },
    });
  };
}
