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
    protected sessionService: SessionService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
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

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];
    console.log(requiredRoles);

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return this.authenticated;
    }

    // Allow the user to proceed if all the required roles are present.
    return (
      requiredRoles.every((role) => this.roles.includes(role)) &&
      this.authenticated
    );
  }
}
