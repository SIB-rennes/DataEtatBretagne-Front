import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'financial-data-subvention-info-dialog',
  templateUrl: './data-subvention-objectifs-dialog.component.html',
})
export class DataSubventionObjectifsDialogComponent {

  actions_proposees: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.actions_proposees = data.actions_proposees;
  }
}
