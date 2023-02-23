import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'lib-register',
  template: '',
})
export class RegisterComponent {
  // redirection vers la page de création de compte
  constructor(protected readonly keycloak: KeycloakService) {
    this.keycloak.register();
  }
}
