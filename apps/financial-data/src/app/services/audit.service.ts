import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { SettingsService } from '../../environments/settings.service';
import {
  AuditUpdateData,
  DataType,
} from '../models/audit/audit-update-data.models';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';

@Injectable({
  providedIn: 'root',
})
export class AuditHttpService {
  constructor(
    private http: HttpClient,
    @Inject(SETTINGS) readonly settings: SettingsService
  ) {}

  public getLastDateUpdateData(): Observable<{ date: string }> {
    const apiData = this.settings.apiAdministration;

    return this.http.get<{ date: string }>(
      `${apiData}/audit/FINANCIAL_DATA/last`
    );
  }

  public getHistoryData(type: DataType): Observable<AuditUpdateData[]> {
    const apiData = this.settings.apiAdministration;

    return this.http
      .get<AuditUpdateData[]>(`${apiData}/audit/${type}`)
      .pipe(map((data: any) => data.items));
  }
}
