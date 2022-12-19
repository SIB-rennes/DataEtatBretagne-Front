import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _userInfo: Keycloak.KeycloakProfile | null = null;

  public userInfo$ = new Subject<Keycloak.KeycloakProfile | null>();

  constructor() {}

  public setAuthentication(info: any): void {
    this._userInfo = info;
    this.userInfo$.next(info);
  }

  public getUser(): Observable<Keycloak.KeycloakProfile | null> {
    return this.userInfo$.asObservable();
  }

  /**
   * Return state of User Connected
   */
  public getCurrentAccount(): Keycloak.KeycloakProfile | null {
    return this._userInfo;
  }
}
