import { NgModule } from '@angular/core';
import { PreferenceUsersComponent } from './components/preference-users.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PreferenceUsersComponent],
  imports: [MatCardModule, MatSlideToggleModule, MatTableModule, CommonModule],
  exports: [PreferenceUsersComponent],
})
export class PreferenceUsersModule {}
