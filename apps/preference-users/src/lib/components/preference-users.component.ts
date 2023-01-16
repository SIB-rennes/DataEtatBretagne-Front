import { Component, OnInit } from '@angular/core';
import { JSONValue, Preference } from '../models/preference.models';
import { PreferenceUsersHttpService } from '../services/preference-users-http.service';

@Component({
  selector: 'lib-preference-users',
  templateUrl: './preference-users.component.html',
  styles: ['.mat-column-filters { width: 80%; }'],
})
export class PreferenceUsersComponent implements OnInit {
  public displayedColumns: string[] = ['name', 'filters'];

  public dataSource: Preference[] = [];

  public readonly objectKeys = Object.keys;
  public readonly json = JSON;

  constructor(private service: PreferenceUsersHttpService) {}

  ngOnInit(): void {
    this.service.getPreferences().subscribe((response) => {
      this.dataSource = response;
    });
  }

  public getTypeField(element: JSONValue) {
    if (Array.isArray(element)) {
      return 'array';
    }

    if (typeof element !== 'object') return 'simple';
    return 'object';
  }
}
