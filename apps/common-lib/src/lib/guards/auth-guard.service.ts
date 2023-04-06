import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { SessionService } from 'apps/common-lib/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard implements CanLoad {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    protected location: Location,
    protected sessionService: SessionService
  ) {
    super(router, keycloak);
  }

  canLoad(route: Route, _segments: UrlSegment[]) {
    if (!this.roles) return true;

    const canLoad = this._checkRoles(route);

    if (!canLoad) {
      this.router.navigate(['']);
    }
    return canLoad;
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
      await this.keycloak.loadUserProfile(),
      this.keycloak.getUserRoles()
    );

    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return this.authenticated;
    }

    // Allow the user to proceed if one role is present
    if (!this._checkRoles(route)) {
      this.router.navigate(['']);
      return false;
    }
    return this.authenticated;
  }

  private _checkRoles(route: ActivatedRouteSnapshot | Route): boolean {
    if (route.data) {
      if (!this.roles) return false;

      const requiredRoles = route.data['roles'] as string[];
      return requiredRoles.some((role) => this.roles.includes(role));
    }

    return true;
  }
}
