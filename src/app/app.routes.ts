
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { DashboardOrgComponent } from './organisateur/dashboard-org/dashboard-org.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { ParticipantDashboardComponent } from './participant/participant-dashboard/participant-dashboard.component';
import { ProfilComponent } from './profil/profil.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: CallbackComponent },
  {path:'dashboard-org', component:DashboardOrgComponent},
    {path:'dashboard-admin', component:DashboardAdminComponent},
    {path:'participant-dashboard', component:ParticipantDashboardComponent},
    { path: 'profil', component: ProfilComponent, canActivate: [authGuard] },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'organisateur',
  loadChildren: () => import('./organisateur/organisateur.module').then(m => m.OrganisationModule)
  },
  {
    path: 'participant',
    loadChildren: () => import('./participant/participant.module').then(m => m.ParticipantModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
