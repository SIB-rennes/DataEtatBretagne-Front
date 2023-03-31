import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profil } from 'apps/common-lib/src/lib/models/profil.enum.model';
import { AuthGuard } from 'apps/common-lib/src/public-api';
import { ManagementUserComponent } from 'apps/management/src/lib/components/management-user/management-user.component';
import { UsersResolver } from '../../resolvers/management/users.resolver';
import { UploadFinancialComponent } from './upload-financial.component';

const routes: Routes = [
  {
    path: 'management',
    component: ManagementUserComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Profil.ADMIN],
    },
    resolve: {
      usersPagination: UsersResolver,
    },
  },
  {
    path: 'upload',
    component: UploadFinancialComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Profil.ADMIN, Profil.COMPTABLE],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
