import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
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

  public getPreferences(): Observable<any> {
    return this.http.get<any>(`${this.apiPath}/users/preferences`);
  }
}
