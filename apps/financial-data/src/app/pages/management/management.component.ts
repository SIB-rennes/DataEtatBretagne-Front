import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { UserHttpService } from '@services/management/users-http.service';
import { ActivatedRoute } from '@angular/router';
import { User, UsersPagination } from '../../models/users/user.models';
import { getFrenchPaginatorIntl } from '../../shared/paginator/french-paginator-intl';
import { LoaderService } from '@services/loader.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'financial-management',
  styleUrls: [],
  standalone: true,
  templateUrl: './management.component.html',
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
  ],
  imports: [
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
    private loading: LoaderService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (response: { usersPagination: UsersPagination | Error } | any) => {
        this.dataSource = response.usersPagination;
      }
    );
  }

  toggleActif(user: User): void {}

  changePage(event: PageEvent): void {
    // TODO fait un httpInterceptor pour le loader
    this.loading.startLoader();

    this.userService
      .getUsers(event.pageIndex + 1, event.pageSize)
      .pipe(
        finalize(() => {
          this.loading.endLoader();
        })
      )
      .subscribe((userPagination: UsersPagination) => {
        this.dataSource = userPagination;
      });
  }
}
