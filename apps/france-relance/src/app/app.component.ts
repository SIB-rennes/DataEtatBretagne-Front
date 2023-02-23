import { Component, OnInit, Inject } from '@angular/core';
import { SETTINGS } from 'apps/common-lib/src/lib/environments/settings.http.service';
import { GridInFullscreenStateService } from 'apps/common-lib/src/lib/services/grid-in-fullscreen-state.service';
import { LoaderService, SessionService } from 'apps/common-lib/src/public-api';
import { SettingsService } from '../environments/settings.service';

@Component({
  selector: 'france-relance-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public progressBarVisible: boolean = false;
  public isAuthenticated: boolean = false;

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
    });
  }

  public get contact(): string | undefined {
    return this.settings.getSetting().contact;
  }
}
