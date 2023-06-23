import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profil } from 'apps/common-lib/src/lib/models/profil.enum.model';
import { keycloakAuthGuardCanActivate } from 'apps/common-lib/src/public-api';
import { ManagementUserComponent } from 'apps/management/src/lib/components/management-user/management-user.component';
import { resolveUsers } from '../../resolvers/management/users.resolver';
import { UploadFinancialComponent } from './upload-financial.component';

const routes: Routes = [
  {
    path: 'management',
    component: ManagementUserComponent,
    canActivate: [keycloakAuthGuardCanActivate],
    data: {
      roles: [Profil.ADMIN],
    },
    resolve: {
      usersPagination: resolveUsers,
    },
  },
  {
    path: 'upload',
    component: UploadFinancialComponent,
    canActivate: [keycloakAuthGuardCanActivate],
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
