import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { Profil } from './models/profil.enum.model';
import { HomeComponent } from './pages/home/home.component';
import { ManagementComponent } from './pages/management/management.component';
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
    component: ManagementComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [Profil.ADMIN],
    },
    resolve: {
      usersPagination: UsersResolver,
    },
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
