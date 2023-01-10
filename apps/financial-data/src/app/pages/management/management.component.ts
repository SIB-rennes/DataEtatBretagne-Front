import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { UserHttpService } from '@services/management/users-http.service';
import { ActivatedRoute } from '@angular/router';
import { User, UsersPagination } from '../../models/users/user.models';
import { getFrenchPaginatorIntl } from '../../shared/paginator/french-paginator-intl';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SessionService } from '@services/session.service';

@Component({
  selector: 'financial-management',
  styleUrls: [],
  standalone: true,
  templateUrl: './management.component.html',
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCardModule,
  ],
})
export class ManagementComponent implements OnInit {
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'username',
    'enabled',
  ];

  @ViewChild(MatPaginator, { static: true }) paginator:
    | MatPaginator
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
        user.enabled = !user.enabled;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  changePage(event: PageEvent): void {
    this.userService
      .getUsers(event.pageIndex + 1, event.pageSize)
      .subscribe((userPagination: UsersPagination) => {
        this.dataSource = userPagination;
      });
  }
}
