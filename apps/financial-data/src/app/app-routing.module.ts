import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'apps/common-lib/src/public-api';
import { ManagementUserComponent } from 'apps/management/src/lib/components/management-user/management-user.component';
import { Profil } from './models/profil.enum.model';
import { HomeComponent } from './pages/home/home.component';
import { PreferenceComponent } from './pages/preference/preference.component';
import { RegisterComponent } from './pages/register/register.component';
import { FinancialDataResolver } from './resolvers/financial-data.resolver';
import { UsersResolver } from './resolvers/management/users.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    resolve: {
      financial: FinancialDataResolver,
    },
  },
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
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'preference',
    component: PreferenceComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
