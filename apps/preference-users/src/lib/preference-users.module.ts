import { NgModule } from '@angular/core';
import { PreferenceUsersComponent } from './components/preference-users.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { SavePreferenceDialogComponent } from './components/save-filter/save-preference-dialog.component';

@NgModule({
  declarations: [PreferenceUsersComponent, SavePreferenceDialogComponent],
  imports: [
    MatCardModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  exports: [PreferenceUsersComponent, SavePreferenceDialogComponent],
})
export class PreferenceUsersModule {}
