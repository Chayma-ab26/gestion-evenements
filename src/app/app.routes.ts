/*
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { DashboardOrgComponent } from './organisateur/dashboard-org/dashboard-org.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { ParticipantDashboardComponent } from './participant/participant-dashboard/participant-dashboard.component';
import { ProfilComponent } from './profil/profil.component';
import { authGuard } from './guard/auth.guard';
import { EventListComponent } from './participant/event-list/event-list.component';
import { ListLocalComponent } from './admin/local/list-local/list-local.component';
import { ReservationLocalComponent } from './organisateur/reservation-local/reservation-local.component';
import { ListParticipantComponent } from './organisateur/list-participant/list-participant.component';
import { CreateEventComponent } from './organisateur/create-event/create-event.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent }from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
   {path:'signup',component:SignupComponent},
  { path: 'callback', component: CallbackComponent },
  {path:'dashboard-org', component:DashboardOrgComponent},

    {path:'dashboard-admin', component:DashboardAdminComponent},
    {path:'participant-dashboard', component:ParticipantDashboardComponent},
   /* { path: 'profil', component: ProfilComponent, canActivate: [authGuard] },
    {path:'event-list',component:EventListComponent},
    {path:'local',component:ListLocalComponent},
    {path:'reservationlocal',component:ReservationLocalComponent},
    {path:'participant',component :ListParticipantComponent},
    {path:'createevent',component :CreateEventComponent},*/
  /*   {
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
providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],

  imports: [RouterModule.forRoot(routes) ,  HttpClientModule    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule {}
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { DashboardOrgComponent } from './organisateur/dashboard-org/dashboard-org.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { ParticipantDashboardComponent } from './participant/participant-dashboard/participant-dashboard.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { EventListComponent } from './participant/event-list/event-list.component';
import { ListLocalComponent } from './admin/local/list-local/list-local.component';
import { ReservationLocalComponent } from './organisateur/reservation-local/reservation-local.component';
import { ListParticipantComponent } from './organisateur/list-participant/list-participant.component';
import { CreateEventComponent } from './organisateur/create-event/create-event.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'callback', component: CallbackComponent },
  { path: 'dashboard-org', component: DashboardOrgComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: 'participant-dashboard', component: ParticipantDashboardComponent },
  {path:'event-list',component:EventListComponent},
    {path:'local',component:ListLocalComponent},
    {path:'reservationlocal',component:ReservationLocalComponent},
    {path:'participant',component :ListParticipantComponent},
    {path:'createevent',component :CreateEventComponent},
  /*   {
  // Lazy-loaded modules
 /*  {
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
  }, */
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule], // HttpClientModule importé
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppRoutingModule {}
