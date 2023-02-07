import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchDataComponent } from './components/search-data/search-data.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { GroupingTableModule } from './components/grouping-table/grouping-table.module';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonHttpInterceptor } from './interceptors/common-http-interceptor';
import { ManagementComponent } from './pages/management/management.component';
import { PreferenceUsersModule } from 'apps/preference-users/src/lib/preference-users.module';
import { API_PREFERENCE_PATH } from 'apps/preference-users/src/public-api';
import { SettingsService } from '../environments/settings.service';
import { PreferenceComponent } from './pages/preference/preference.component';
import {
  API_REF_PATH,
  API_GEO_PATH,
  CommonLibModule,
  MaterialModule,
} from 'apps/common-lib/src/public-api';
import {
  SETTINGS,
  SettingsHttpService,
} from 'apps/common-lib/src/lib/environments/settings.http.service';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreferenceComponent,
    SearchDataComponent,
    ManagementComponent,
  ],
  providers: [
    {
      provide: SETTINGS,
      useClass: SettingsService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      multi: true,
      deps: [SettingsHttpService, KeycloakService, SettingsService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonHttpInterceptor,
      multi: true,
    },
    DatePipe,
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR',
    },
    {
      provide: API_PREFERENCE_PATH,
      useFactory: (settings: SettingsService) => {
        return settings.apiManagement;
      },
      deps: [SETTINGS],
    },
    {
      provide: API_GEO_PATH,
      useFactory: (settings: SettingsService) => {
        return settings.apiGeo;
      },
      deps: [SETTINGS],
    },
    {
      provide: API_REF_PATH,
      useFactory: (settings: SettingsService) => {
        return settings.apiReferentiel;
      },
      deps: [SETTINGS],
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    GroupingTableModule,
    MatDialogModule,
    MatButtonModule,
    PreferenceUsersModule,
    CommonLibModule,
  ],
})
export class AppModule {}

export function app_Init(
  settingsHttpService: SettingsHttpService
): () => Promise<any> {
  return () => settingsHttpService.initializeApp();
}
