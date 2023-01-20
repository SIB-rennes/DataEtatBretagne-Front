import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertSnackBarComponent } from './components/alert-snackbar.component';

@NgModule({
  declarations: [AlertSnackBarComponent],
  imports: [CommonModule],
  exports: [AlertSnackBarComponent],
})
export class CommonLibModule {}
