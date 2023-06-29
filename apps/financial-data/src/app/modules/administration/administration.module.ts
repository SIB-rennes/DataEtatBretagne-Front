import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { UploadFinancialComponent } from './upload-financial/upload-financial.component';
import {
  CommonLibModule,
  MaterialModule,
} from 'apps/common-lib/src/public-api';
import { MatDialogModule } from '@angular/material/dialog';

import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [UploadFinancialComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    CommonLibModule,
    AdministrationRoutingModule,
    MaterialModule,
    FormsModule,
    MatDialogModule
  ],
})
export class AdministrationModule {}
