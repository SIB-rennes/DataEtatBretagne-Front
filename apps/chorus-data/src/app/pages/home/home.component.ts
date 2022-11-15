import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'chorus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  public isLogIn(): boolean {
    return false;
  }

  public logout(): void {}
}
