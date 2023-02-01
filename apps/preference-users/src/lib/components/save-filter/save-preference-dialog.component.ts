import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'apps/common-lib/src/public-api';
import { debounceTime, Subject } from 'rxjs';
import { Preference, Shared } from '../../models/preference.models';
import { PreferenceUsersHttpService } from '../../services/preference-users-http.service';

/**
 * Dialog box for selecting table columns to group data by.
 */
@Component({
  templateUrl: './save-preference-dialog.component.html',
  styleUrls: ['./save-preference-dialog.component.scss'],
})
export class SavePreferenceDialogComponent {
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public preference: Preference;

  public shared: Boolean = false;

  public searchUser: string = '';

  public filterUser: any = null;

  public searchUserChanged = new Subject<string>();

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<SavePreferenceDialogComponent>,
    private service: PreferenceUsersHttpService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: Preference
  ) {
    this.preference = data;
    // si la préférence d'origine est déjà partagé ou si elle est déjà créé sans partage,
    // on active par défaut la checkbox de partage
    if ((data.shares && data.shares.length > 0) || data.uuid) {
      this.shared = true;
    } else {
      this.preference.shares = [];
    }

    this.searchUserChanged.pipe(debounceTime(300)).subscribe(() => {
      this._searchUser();
    });
  }

  /**
   * Déclenche une action pour lancer une nouvelle recherche des utilisateurs
   */
  public changeSearchUsername() {
    this.searchUserChanged.next(this.searchUser);
  }

  /**
   * Action quand on valide la préférence/partage
   */
  public validate(): void {
    if (this.preference.name) {
      this.service.savePreference(this.preference).subscribe((_response) => {
        this.alertService.openAlertSuccess('Filtre enregistré avec succès');
        this.dialogRef.close(this.preference);
      });
    }
  }

  /**
   * Action quand on ajoute un courriel au partage
   * @param username
   */
  public addUser(username: string) {
    this.preference.shares?.push({ shared_username_email: username });
    this.userInput.nativeElement.value = '';
    this.searchUser = '';
    this.filterUser = [];
  }

  /**
   * Action quand on supprime un utilisateur du partage
   * @param user
   */
  public removeUserSelected(user: Shared) {
    const index = this.preference.shares?.indexOf(user);

    if (index && index >= 0) {
      this.preference.shares?.splice(index, 1);
    }
  }

  /**
   * Lance la recherche d'utilisateur par service.
   * SI pas de réponse et que la recherche est une adresse mail valide, on propose de l'ajouter
   */
  private _searchUser() {
    if (this.searchUser.length > 3) {
      this.service.searchUser(this.searchUser).subscribe((response) => {
        if (response.length > 0) {
          // on filtre pour éviter les doublons
          this.filterUser = response.filter(
            (userInResponse: { username: string }) =>
              this.preference.shares?.findIndex(
                (userSelect) =>
                  userSelect.shared_username_email === userInResponse.username
              ) === -1
          );
        } else if (this._isValidEmail(this.searchUser)) {
          this.filterUser = [{ username: this.searchUser }];
        } else {
          this.filterUser = null;
        }
      });
    }
  }

  /**
   * Check la validité d'un courriel
   * @param email
   * @returns
   */
  private _isValidEmail(email: string) {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }
}
