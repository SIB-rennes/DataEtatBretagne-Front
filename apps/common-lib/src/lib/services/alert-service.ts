import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  AlertSnackBarComponent,
  AlertType,
} from '../components/snackbar/alert-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private _snackBar: MatSnackBar) {}

  public openAlertSuccess(message: string): void {
    this._snackBar.openFromComponent(AlertSnackBarComponent, {
      duration: 5 * 1000,
      panelClass: 'toaster',
      data: {
        type: AlertType.Success,
        message: message,
      },
    });
  }

  public openAlertError(message: string): void {
    this._snackBar.openFromComponent(AlertSnackBarComponent, {
      duration: 5 * 1000,
      panelClass: 'toaster',
      data: {
        type: AlertType.Error,
        message: message,
      },
    });
  }
}
