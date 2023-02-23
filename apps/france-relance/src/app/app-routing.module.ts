import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from 'apps/common-lib/src/lib/components/register/register.component';
import { TermOfUseComponent } from 'apps/common-lib/src/lib/components/term-of-use/term-of-use.component';
import { Profil } from 'apps/common-lib/src/lib/models/profil.enum.model';
import { AuthGuard } from 'apps/common-lib/src/public-api';
import { ManagementUserComponent } from 'apps/management/src/public-api';
import { HomeComponent } from './pages/home/home.component';
import { PreferenceComponent } from './pages/preference/preference.component';
import { FranceRelanceResolvers } from './resolvers/france-relance.resolvers';
import { UsersResolver } from './resolvers/management/users.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    resolve: {
      axes: FranceRelanceResolvers,
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
    path: 'cgu',
    component: TermOfUseComponent,
    canActivate: [AuthGuard],
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
