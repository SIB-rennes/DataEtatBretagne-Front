import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { UploadFinancialComponent } from './upload-financial.component';
import {
  CommonLibModule,
  MaterialModule,
} from 'apps/common-lib/src/public-api';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UploadFinancialComponent],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MaterialModule,
    FormsModule,
  ],
})
export class AdministrationModule {}
