import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BopModel } from '@models/bop.models';
import { map, Observable, of } from 'rxjs';
import { ChorusResponse } from '@models/chorus_response.models';
import { SettingsService } from '../../environments/settings.service';
import { RefTheme } from '../models/theme.models';

@Injectable({
  providedIn: 'root',
})
export class ChorusHttpService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  public getBop(): Observable<BopModel[]> {
    const apiChorus = this.settings.apiChorus;

    const params = 'limit=500&fields=Id,Label,Code,RefTheme';
    return this.http
      .get<ChorusResponse<BopModel>>(
        `${apiChorus}/RefCodeProgramme/RefCodeProgramme?${params}`
      )
      .pipe(map((response) => response.list));
  }

  /**
   * Récupère les themes de Chorus
   * @returns les the
   */
  public getTheme(): Observable<RefTheme[]> {
    const apiChorus = this.settings.apiChorus;

    return this.http
      .get<ChorusResponse<RefTheme>>(
        `${apiChorus}/RefTheme/RefTheme?fields=Id,Label&sort=Label`
      )
      .pipe(map((response) => response.list));
  }
}
