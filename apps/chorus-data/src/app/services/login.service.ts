import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private loggedIn = false;

  constructor(private keycloak: KeycloakService) {}

  async isLoggedIn(): Promise<boolean> {
    this.loggedIn = await this.keycloak.isLoggedIn();
    return this.loggedIn;
  }

  public login() {
    // this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
