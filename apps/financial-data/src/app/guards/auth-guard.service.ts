import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    protected location: Location,
    private sessionService: SessionService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      console.debug('[AuthGuard] this.keycloak.login');
      await this.keycloak.login({
        redirectUri:
          window.location.origin + this.location.prepareExternalUrl(state.url),
      });
    }

    this.sessionService.setAuthentication(
      await this.keycloak.loadUserProfile()
    );

    // Allow the user to proceed if all the required roles are present.
    return this.authenticated;
  }
}
