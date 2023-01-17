import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Preference } from '../../models/preference.models';
import { PreferenceUsersHttpService } from '../../services/preference-users-http.service';

/**
 * Boite de dialogue pour la sélection des colonnes du tableau selon lesquelles regrouper les données.
 */
@Component({
  templateUrl: './save-preference-dialog.component.html',
  styleUrls: ['./save-preference-dialog.component.scss'],
})
export class SavePreferenceDialogComponent {
  public preference: Preference;
  constructor(
    public dialogRef: MatDialogRef<SavePreferenceDialogComponent>,
    private service: PreferenceUsersHttpService,
    @Inject(MAT_DIALOG_DATA) public data: Preference
  ) {
    this.preference = data;
  }

  public validate(): void {
    if (this.preference.name) {
      this.service.savePreference(this.preference).subscribe((response) => {
        this.dialogRef.close(this.preference);
      });
    }
  }
}
