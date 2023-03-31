import { Component, OnInit, Inject } from '@angular/core';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { Profil } from 'apps/common-lib/src/lib/models/profil.enum.model';
import { GridInFullscreenStateService } from 'apps/common-lib/src/lib/services/grid-in-fullscreen-state.service';
import { LoaderService, SessionService } from 'apps/common-lib/src/public-api';
import { SettingsService } from '../environments/settings.service';

@Component({
  selector: 'financial-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public progressBarVisible: boolean = false;
  public isAuthenticated: boolean = false;

  public isAdmin = false;

  public displayAdmin = false;

  get grid_fullscreen() {
    return this._gridFullscreen.fullscreen;
  }

  constructor(
    private loaderService: LoaderService,
    private sessionService: SessionService,
    private _gridFullscreen: GridInFullscreenStateService,
    @Inject(SETTINGS) public readonly settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading().subscribe((loading) => {
      this.progressBarVisible = loading;
    });

    this.sessionService.getUser().subscribe((user) => {
      this.isAuthenticated = user !== null;
      this.isAdmin = this.sessionService.isAdmin();
      this.displayAdmin = this.sessionService.hasOneRole([
        Profil.COMPTABLE,
        Profil.ADMIN,
      ]);
    });
  }

  public get contact(): string | undefined {
    return this.settings.getSetting().contact;
  }
}
