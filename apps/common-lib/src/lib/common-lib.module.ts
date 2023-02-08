import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSnackBarComponent } from './components/snackbar/alert-snackbar.component';
import { LocalisationComponent } from './components/localisation/localisation.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [AlertSnackBarComponent, FooterComponent],
  imports: [
    CommonModule,
    LocalisationComponent,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
  ],
  exports: [
    AlertSnackBarComponent,
    LocalisationComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class CommonLibModule {}
