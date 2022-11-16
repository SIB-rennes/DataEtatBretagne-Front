import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchDataComponent } from './components/search-data/search-data.component';
import { HomeComponent } from './pages/home/home.component';
import { SettingsHttpService } from '../environments/settings.http.service';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchDataComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: app_Init,
      multi: true,
      deps: [SettingsHttpService, KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function app_Init(
  settingsHttpService: SettingsHttpService
): () => Promise<any> {
  return () => settingsHttpService.initializeApp();
}
