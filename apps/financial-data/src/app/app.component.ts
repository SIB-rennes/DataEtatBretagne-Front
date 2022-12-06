import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { SessionService } from './services/session.service';

@Component({
  selector: 'financial-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public user: KeycloakProfile | null = null;

  constructor(
    private session: SessionService,
    private keycloak: KeycloakService
  ) {}

  public ngOnInit() {
    this.session.getUser().subscribe((user) => {
      if (user != null) {
        this.isLoggedIn = true;
        this.user = user;
      }
    });
  }

  public logout() {
    this.keycloak.logout().then(() => {
      this.keycloak.clearToken();
    });
    this.isLoggedIn = false;
  }
}
