import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { UserHttpService } from '../../services/management/users-http.service';
import { ActivatedRoute } from '@angular/router';
import { User, UsersPagination } from '../../models/users/user.models';

@Component({
  selector: 'financial-management',
  styleUrls: [],
  standalone: true,
  templateUrl: './management.component.html',
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

  public dataSource: UsersPagination = { users: [] };

  constructor(
    private userService: UserHttpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (response: { usersPagination: UsersPagination | Error } | any) => {
        this.dataSource = response.usersPagination;
        console.log(this.dataSource);
      }
    );
  }

  toggleActif(user: User): void {}
}
