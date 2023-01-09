import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { User } from '@models/users/user.models';
import { SessionService } from '@services/session.service';

@Component({
  selector: 'financial-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isLoggedIn = false;
  public user: User | null = null;

  constructor(
    protected session: SessionService,
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
