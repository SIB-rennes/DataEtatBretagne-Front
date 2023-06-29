import { Injectable, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, GuardsCheckEnd, Router, RouterStateSnapshot } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { SessionService } from 'apps/common-lib/src/public-api';
import { NGXLogger } from 'ngx-logger';
import { AuthUtils } from '../services/auth-utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService,
    protected location: Location,
    protected sessionService: SessionService,
    protected auth_utils: AuthUtils,
    private logger: NGXLogger,
  ) {
    super(router, keycloak);
  }

  private _current_roles = null;
  get current_roles() : string[] {
    if (!this._current_roles)
      this._current_roles = this.auth_utils.roles_to_uppercase(this.roles)

    return this._current_roles!;
  }

  get currentlyAuthenticated() {
    return this.authenticated;
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      this.logger.debug(`[AuthGuard] keycloak login`);
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
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0)
      return true;

    // Allow the user to proceed if one role is present
    return this.has_any_roles(requiredRoles);
  }

  public has_any_roles(roles: string[]): boolean {
    if (!this.current_roles)
      return false;
    return roles.some(role => this.current_roles.includes(role));
  }
}

/** 
 * Vérifie les roles de la personne authentifiée.
 * si aucune authentification, on match
 */
export const keycloakAuthGuardCanMatchAccordingToRoles: CanMatchFn = (route) => {

  const data = route.data
  const requiredRoles: string[] = (data)? data['roles'] : [];

  let guard = inject(AuthGuard)

  if (!guard.currentlyAuthenticated)
    return true

  return guard.has_any_roles(requiredRoles);
}

export const keycloakAuthGuardCanActivate: CanActivateFn = (route, state) => {
  const guard = inject(AuthGuard)
  return guard.canActivate(route, state);
}