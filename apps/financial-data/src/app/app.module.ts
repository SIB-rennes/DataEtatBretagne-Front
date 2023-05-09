import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpHeaders,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchDataComponent } from './components/search-data/search-data.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PreferenceUsersModule } from 'apps/preference-users/src/lib/preference-users.module';
import { API_PREFERENCE_PATH } from 'apps/preference-users/src/public-api';
import { SettingsService } from '../environments/settings.service';
import { PreferenceComponent } from './pages/preference/preference.component';
import {
  API_REF_PATH,
  API_GEO_PATH,
  CommonLibModule,
  MaterialModule,
  CommonHttpInterceptor,
} from 'apps/common-lib/src/public-api';
import {
  SETTINGS,
  SettingsHttpService,
} from 'apps/common-lib/src/lib/environments/settings.http.service';
import { ManagementModule } from 'apps/management/src/public-api';
import { API_MANAGEMENT_PATH } from 'apps/management/src/lib/services/users-http.service';
import { GroupingTableModule } from 'apps/grouping-table/src/public-api';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import {
  aeApiModule,
  aeConfiguration,
  aeConfigurationParameters,
} from 'apps/clients/apis-externes';
import { ApolloLink, InMemoryCache } from '@apollo/client';

export function apiConfigFactory(
  settingsService: SettingsService
): aeConfiguration {
  const params: aeConfigurationParameters = {
    withCredentials: false,
    basePath: settingsService.apiExternes,
  };

  return new aeConfiguration(params);
}

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreferenceComponent,
    SearchDataComponent,
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
        return settings.apiAdministration;
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
    {
      provide: API_MANAGEMENT_PATH,
      useFactory: (settings: SettingsService) => {
        return settings.apiAdministration;
      },
      deps: [SETTINGS],
    },
    {
      provide: aeConfiguration,
      useFactory: apiConfigFactory,
      deps: [SETTINGS],
      multi: false,
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink, settings: SettingsService) {
        const apiDs = settings.apiDs;
        console.log(apiDs);
        console.log('ICI');
        const http = httpLink.create({ uri: apiDs?.url });
        const middleware = new ApolloLink((operation, forward) => {
          operation.setContext({
            headers: new HttpHeaders().set(
              'Authorization',
              `Bearer ${apiDs?.token}`
            ),
          });
          return forward(operation);
        });

        const link = middleware.concat(http);

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink, SETTINGS],
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
    MatProgressSpinnerModule,
    PreferenceUsersModule,
    CommonLibModule,
    ManagementModule,
    aeApiModule,
    ApolloModule,
  ],
})
export class AppModule {}

export function app_Init(
  settingsHttpService: SettingsHttpService
): () => Promise<any> {
  return () => settingsHttpService.initializeApp();
}
