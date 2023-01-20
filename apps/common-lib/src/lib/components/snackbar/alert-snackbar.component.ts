import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export enum AlertType {
  Error = 'error',
  Success = 'success',
  Info = 'info',
}

export interface AlertMessage {
  message: string;
  type: AlertType;
}

@Component({
  selector: 'lib-snackbar',
  templateUrl: './alert-snackbar.component.html',
  styles: ['h3 {font-size: 1.25rem; line-height: 1.75rem; font-weight: 700}'],
})
export class AlertSnackBarComponent {
  public classAlert: string;
  public title: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public alert: AlertMessage) {
    console.log(alert);

    this.classAlert = 'fr-alert--info';
    this.title = 'Information';
    if (alert.type === AlertType.Error) {
      this.classAlert = 'fr-alert--error';
      this.title = 'Erreur';
    }
    if (alert.type === AlertType.Success) {
      this.classAlert = 'fr-alert--success';
      this.title = 'Succès';
    }
  }
}
