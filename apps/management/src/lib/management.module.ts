import { NgModule } from '@angular/core';
import { ManagementUserComponent } from './components/management-user/management-user.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ManagementUserComponent],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCardModule,
    MatCheckboxModule,
    CommonModule,
  ],
  exports: [ManagementUserComponent],
})
export class ManagementModule {}
