import { Component, OnInit, ViewChild, Inject, inject } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { AlertService, SessionService } from 'apps/common-lib/src/public-api';
import { getFrenchPaginatorIntl } from '../../shared/paginator/french-paginator-intl';
import { User, UsersPagination } from '../../models/users/user.models';
import { UserHttpService } from '../../services/users-http.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-management-user',
  templateUrl: './management-user.component.html',
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
  ],
})
export class ManagementUserComponent implements OnInit {
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'enabled',
  ];

  private dialog = inject(MatDialog);

  @ViewChild(MatCheckbox, { static: true }) public checkbox:
    | MatCheckbox
    | undefined;
  public dataSource: UsersPagination = { users: [] };

  constructor(
    private userService: UserHttpService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    protected session: SessionService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (response: { usersPagination: UsersPagination | Error } | any) => {
        this.dataSource = response.usersPagination;
      }
    );
  }

  toggleEnabled(user: User, event: MatSlideToggleChange): void {
    if (user.id === undefined) return;
    let request: Observable<string>;

    if (event.checked) {
      request = this.userService.enableUser(user.id);
    } else {
      request = this.userService.disableUser(user.id);
    }
    request.subscribe({
      next: (_response: string) => {
        if (this.checkbox?.checked === true) {
          this._retrieve_users(true).subscribe(
            (userPagination: UsersPagination) => {
              this.dataSource = userPagination;
            }
          );
        } else {
          user.enabled = !user.enabled;
        }

        this.alertService.openAlertSuccess(
          `Utilisateur ${user.email} ${
            user.enabled ? 'activé' : 'désactivé'
          } avec succès.`
        );
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  public confirmDelete(user: User): void {
    if (user.id === undefined) return;

    const requestDelete = this.userService.deleteUsers(user.id);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Êtes-vous sûr de vouloir supprimer l\'utilisateur?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        requestDelete.subscribe({
            next: (_response: string) => {
              this._retrieve_users(this.checkbox?.checked ?? false, 1).subscribe(
                (userPagination: UsersPagination) => {
                  this.dataSource = userPagination;
                }
              );

              this.alertService.openAlertSuccess(
                `Utilisateur ${user.email} supprimé avec succès.`
              );
            },
            error: (error: any) => {
              console.error(error);
            },

        })
      }
    });
  }

  public onlyDisableUser(event: MatCheckboxChange): void {
    this._retrieve_users(event.checked).subscribe(
      (userPagination: UsersPagination) => {
        this.dataSource = userPagination;
      }
    );
  }

  public changePage(event: PageEvent): void {
    this._retrieve_users(
      this.checkbox?.checked ?? false,
      event.pageIndex + 1,
      event.pageSize
    ).subscribe((userPagination: UsersPagination) => {
      this.dataSource = userPagination;
    });
  }

  private _retrieve_users(
    only_disable: boolean,
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<UsersPagination> {
    return this.userService.getUsers(only_disable, pageIndex, pageSize);
  }
}


@Component({
  selector: 'lib-management-confirm',
  template: `
    <h2 mat-dialog-title>Confirmation</h2>

    <div mat-dialog-content>
    {{ message }}
    </div>
    <mat-dialog-actions align="end">
      <button mat-button color="warn" type="button" [mat-dialog-close]="true" cdkFocusInitial>Oui</button>
      <button mat-button mat-dialog-close type="button">Non</button>
    </mat-dialog-actions>
  `
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) {}
}
