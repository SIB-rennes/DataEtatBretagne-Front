import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from 'apps/common-lib/src/lib/components/register/register.component';
import { TermOfUseComponent } from 'apps/common-lib/src/lib/components/term-of-use/term-of-use.component';
import { Profil } from 'apps/common-lib/src/lib/models/profil.enum.model';
import { keycloakAuthGuardCanActivate } from 'apps/common-lib/src/public-api';
import { ManagementUserComponent } from 'apps/management/src/public-api';
import { HomeComponent } from './pages/home/home.component';
import { PreferenceComponent } from './pages/preference/preference.component';
import { resolveFranceRelance } from './resolvers/france-relance.resolvers';
import { resolveUsers } from './resolvers/management/users.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [keycloakAuthGuardCanActivate],
    runGuardsAndResolvers: 'always',
    resolve: {
      axes: resolveFranceRelance,
    },
  },
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
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'cgu',
    component: TermOfUseComponent,
    canActivate: [keycloakAuthGuardCanActivate],
  },
  {
    path: 'preference',
    component: PreferenceComponent,
    canActivate: [keycloakAuthGuardCanActivate],
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
