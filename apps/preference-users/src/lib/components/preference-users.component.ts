import { Component, Input, OnInit, inject } from '@angular/core';
import {
  JSONValue,
  Preference,
  MapPreferenceFilterMetadata,
} from '../models/preference.models';
import { MatDialog } from '@angular/material/dialog';
import { PreferenceUsersHttpService } from '../services/preference-users-http.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'lib-preference-users',
  templateUrl: './preference-users.component.html',
  styles: ['.mat-column-filters { width: 75%; }'],
})
export class PreferenceUsersComponent implements OnInit {
  /**
   * Object pour mapper le nom du filtre avec une String affichable. Par défaut on affiche le nom du filtre
   */
  @Input() mappingMetadata!: MapPreferenceFilterMetadata;

  private dialog = inject(MatDialog);

  public displayedColumns: string[] = ['name', 'filters', 'actions'];

  public dataSource: Preference[] = [];

  public readonly objectKeys = Object.keys;
  public readonly json = JSON;

  constructor(private service: PreferenceUsersHttpService) {}

  ngOnInit(): void {
    this.service.getPreferences().subscribe((response) => {
      this.dataSource = response;
    });
  }

  public getTypeField(element: JSONValue) {
    if (Array.isArray(element)) {
      return 'array';
    }

    if (typeof element !== 'object') return 'simple';
    return 'object';
  }

  /**
   * Lance la suppression d'une préférence
   * @param uuid
   */
  public deleteFilter(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Êtes-vous sûrs de vouloir supprimer le filtre ?',
      width: '40rem',
      autoFocus: 'input',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.deletePreference(uuid).subscribe(() => {
          this.dataSource = this.dataSource.filter(
            (data) => data.uuid && data.uuid !== uuid
          );
        });
      }
    });
  }
}
