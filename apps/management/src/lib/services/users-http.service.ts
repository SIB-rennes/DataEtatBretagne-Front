import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersPagination } from '../models/users/user.models';

export const API_MANAGEMENT_PATH = new InjectionToken<string>(
  'Api management path'
);

/**
 * Service for user-related HTTP requests
 */
@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  /**
   * Service constructor
   * @param http HttpClient object for making HTTP requests
   * @param settings Settings service for retrieving API URL information
   */
  constructor(
    private http: HttpClient,
    @Inject(API_MANAGEMENT_PATH) private readonly apiPath: string
  ) {}

  /**
   * Gets a list of users
   * @param pageNumber Page number to retrieve (default: 1)
   * @param limit Maximum number of users to retrieve per page (default: 2)
   * @param only_disbale Ony disable users is return
   * @returns Observable containing user pagination data
   */
  public getUsers(
    only_disable: boolean = false,
    pageNumber: number = 1,
    limit: number = 10
  ): Observable<UsersPagination> {
    const params = `pageNumber=${pageNumber}&limit=${limit}&only_disable=${only_disable}`;

    return this.http.get<UsersPagination>(`${this.apiPath}/users?${params}`);
  }

  /**
   * Disables a user
   * @param uuid Unique identifier of the user to disable
   * @returns Observable containing a confirmation message
   */
  public disableUser(uuid: string): Observable<string> {
    return this.http.patch<string>(
      `${this.apiPath}/users/disable/${uuid}`,
      null
    );
  }

  /**
   * Enables a user
   * @param uuid Unique identifier of the user to enable
   * @returns Observable containing a confirmation message
   */
  public enableUser(uuid: string): Observable<string> {
    return this.http.patch<string>(
      `${this.apiPath}/users/enable/${uuid}`,
      null
    );
  }
}
