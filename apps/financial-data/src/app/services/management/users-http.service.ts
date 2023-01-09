import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { SettingsService } from '../../../environments/settings.service';
import { UsersPagination } from '@models/users/user.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getUsers(
    pageNumber: number = 1,
    limit: number = 2
  ): Observable<UsersPagination> {
    const apiManagement = this.settings.apiManagement;

    const params = `pageNumber=${pageNumber}&limit=${limit}`;

    return this.http.get<UsersPagination>(`${apiManagement}/users/?${params}`);
  }

  public disableUser(uuid: string): Observable<string> {
    const apiManagement = this.settings.apiManagement;

    return this.http.patch<string>(
      `${apiManagement}/users/disable/${uuid}`,
      null
    );
  }

  public enableUser(uuid: string): Observable<string> {
    const apiManagement = this.settings.apiManagement;

    return this.http.patch<string>(
      `${apiManagement}/users/enable/${uuid}`,
      null
    );
  }
}
