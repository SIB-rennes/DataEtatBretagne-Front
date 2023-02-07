import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { SessionService } from '../../services/session.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from 'apps/management/src/lib/models/users/user.models';

@Component({
  selector: 'lib-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    RouterModule,
    MatMenuModule,
  ],
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
