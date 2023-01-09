import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '@models/users/user.models';
import { Profil } from '@models/profil.enum.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private _userInfo: User | null = null;

  public userInfo$ = new Subject<User | null>();

  constructor() {}

  public setAuthentication(info: Keycloak.KeycloakProfile, roles: any): void {
    this._userInfo = info as User;
    this._userInfo.roles = roles;
    this.userInfo$.next(this._userInfo);
  }

  public getUser(): Observable<User | null> {
    return this.userInfo$.asObservable();
  }

  /**
   * Return state of User Connected
   */
  public getCurrentAccount(): User | null {
    return this._userInfo;
  }

  public isAdmin(): boolean {
    return (
      this._userInfo !== null && this._userInfo?.roles.includes(Profil.ADMIN)
    );
  }
}
