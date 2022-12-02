import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'chorus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public user: KeycloakProfile | null = null;

  constructor(private keycloak: KeycloakService) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (!this.isLoggedIn) {
      this.keycloak.login();
    } else {
      this.user = await this.keycloak.loadUserProfile();
    }
  }

  public logout() {
    this.keycloak.logout().then(() => {
      this.keycloak.clearToken();
    });
    this.isLoggedIn = false;
  }
}
