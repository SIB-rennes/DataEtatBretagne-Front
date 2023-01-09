import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../../environments/settings.service';
import { UsersPagination } from '@models/users/user.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getUsers(
    pageNumber: number = 0,
    limit: number = 10
  ): Observable<UsersPagination> {
    const apiManagement = this.settings.apiManagement;

    const params = `pageNumber=${pageNumber}&limit=${limit}`;

    return this.http.get<UsersPagination>(`${apiManagement}/users/?${params}`);
  }
}
