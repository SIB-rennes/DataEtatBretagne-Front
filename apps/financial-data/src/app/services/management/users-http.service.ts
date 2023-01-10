import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SettingsService } from '../../../environments/settings.service';
import { UsersPagination } from '@models/users/user.models';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient, private settings: SettingsService) {}

  /**
   * Gets a list of users
   * @param pageNumber Page number to retrieve (default: 1)
   * @param limit Maximum number of users to retrieve per page (default: 2)
   * @returns Observable containing user pagination data
   */
  public getUsers(
    pageNumber: number = 1,
    limit: number = 10
  ): Observable<UsersPagination> {
    const apiManagement = this.settings.apiManagement;

    const params = `pageNumber=${pageNumber}&limit=${limit}`;

    return this.http.get<UsersPagination>(`${apiManagement}/users?${params}`);
  }

  /**
   * Disables a user
   * @param uuid Unique identifier of the user to disable
   * @returns Observable containing a confirmation message
   */
  public disableUser(uuid: string): Observable<string> {
    const apiManagement = this.settings.apiManagement;

    return this.http.patch<string>(
      `${apiManagement}/users/disable/${uuid}`,
      null
    );
  }

  /**
   * Enables a user
   * @param uuid Unique identifier of the user to enable
   * @returns Observable containing a confirmation message
   */
  public enableUser(uuid: string): Observable<string> {
    const apiManagement = this.settings.apiManagement;

    return this.http.patch<string>(
      `${apiManagement}/users/enable/${uuid}`,
      null
    );
  }
}
