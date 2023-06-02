import { Component, Inject, inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { RowData } from 'apps/grouping-table/src/lib/components/grouping-table/group-utils';
import { InformationsSupplementairesComponent } from '../informations-supplementaires.component';

export interface InformationsSupplementairesDialogData {
  row: RowData
}


@Component({
  standalone: true,
  selector: 'financial-informations-supplementaires-dialog',
  templateUrl: './informations-supplementaires-dialog.component.html',
  imports: [
    InformationsSupplementairesComponent,
    MatDialogModule
  ],
})
export class InformationsSupplementairesDialogComponent {


  public ej: string
  public poste_ej: number

  constructor(@Inject(MAT_DIALOG_DATA) public data: InformationsSupplementairesDialogData) {
    this.ej = data.row['n_ej']
    this.poste_ej = parseInt(data.row['n_poste_ej'])
  }
}
