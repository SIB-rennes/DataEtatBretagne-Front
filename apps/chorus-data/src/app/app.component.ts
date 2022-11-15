import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { LoginService } from './services/login.service';

@Component({
  selector: 'chorus-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;

  constructor(private keycloak: KeycloakService) {}

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (!this.isLoggedIn) {
      this.keycloak.login();
    } else {
      console.log(await this.keycloak.getToken());
      console.log(await this.keycloak.loadUserProfile());
    }
  }
}
