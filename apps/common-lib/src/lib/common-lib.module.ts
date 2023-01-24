import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSnackBarComponent } from './components/snackbar/alert-snackbar.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { LocalisationComponent } from './components/localisation/localisation.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [AlertSnackBarComponent, LocalisationComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatSelectModule,
  ],
  exports: [AlertSnackBarComponent, LocalisationComponent],
})
export class CommonLibModule {}
