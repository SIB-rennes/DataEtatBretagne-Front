import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  checkLogin(): Promise<Keycloak.KeycloakProfile> {
    return this.keycloakService.loadUserProfile();
  }

  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  logout(): void {
    this.keycloakService.logout().then(() => {
      this.keycloakService.clearToken();
    });
  }
}
