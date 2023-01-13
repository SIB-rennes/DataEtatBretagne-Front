import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UserHttpService } from '@services/management/users-http.service';
import { ActivatedRoute } from '@angular/router';
import { User, UsersPagination } from '@models/users/user.models';
import { getFrenchPaginatorIntl } from '../../shared/paginator/french-paginator-intl';
import { Observable } from 'rxjs';
import { SessionService } from '@services/session.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'financial-management',
  styleUrls: [],
  templateUrl: './management.component.html',
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
  ],
})
export class ManagementComponent implements OnInit {
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'enabled',
  ];

  @ViewChild(MatCheckbox, { static: true }) public checkbox:
    | MatCheckbox
    | undefined;
  public dataSource: UsersPagination = { users: [] };

  constructor(
    private userService: UserHttpService,
    private route: ActivatedRoute,
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
      },
      error: (error: any) => {
        console.error(error);
      },
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
