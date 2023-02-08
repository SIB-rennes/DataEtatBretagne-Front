import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Preference, PreferenceWithShared } from '../models/preference.models';
export const API_PREFERENCE_PATH = new InjectionToken<string>(
  'Helper service type'
);

@Injectable({
  providedIn: 'root',
})
export class PreferenceUsersHttpService {
  /**
   * Service constructor
   * @param http HttpClient object for making HTTP requests
   * @param apiPath Path api
   */
  constructor(
    private http: HttpClient,
    @Inject(API_PREFERENCE_PATH) private readonly apiPath: string
  ) {}

  public getPreferences(): Observable<PreferenceWithShared> {
    return this.http.get<PreferenceWithShared>(
      `${this.apiPath}/users/preferences`
    );
  }

  public savePreference(preference: Preference): Observable<any> {
    if (preference.uuid) {
      // update
      return this.http.post(
        `${this.apiPath}/users/preferences/${preference.uuid}`,
        preference
      );
    } else {
      // create
      return this.http.post(`${this.apiPath}/users/preferences`, preference);
    }
  }

  public deletePreference(uuid: string): Observable<any> {
    return this.http.delete(`${this.apiPath}/users/preferences/${uuid}`);
  }

  public getPreference(uuid: string): Observable<Preference> {
    return this.http.get<Preference>(
      `${this.apiPath}/users/preferences/${uuid}`
    );
  }

  public searchUser(search: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiPath}/users/preferences/search-user?username=${search}`
    );
  }
}
