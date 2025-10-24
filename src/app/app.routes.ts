
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
import { ListUsersComponent } from './admin/users/list-users/list-users.component';
import { ListCategoryComponent } from './admin/category/list-category/list-category.component';
import { MesReservationsComponent } from './participant/mes-reservations/mes-reservations.component';

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
    {path: 'users', component: ListUsersComponent},
    { path: 'category', component: ListCategoryComponent},
    {path:'mes-reservations',component:MesReservationsComponent},
    
 
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
