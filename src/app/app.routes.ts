import { RouterModule, Routes } from '@angular/router';
import { ListCategoryComponent } from './admin/category/list-category/list-category.component';
import { ListLocalComponent } from './admin/local/list-local/list-local.component';
import { ListUsersComponent } from './admin/users/list-users/list-users.component';
import { ListEventsComponent } from './admin/events/list-events/list-events.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { DashboardAdminComponent } from './admin/dashboard-admin/dashboard-admin.component';
import { CreateEventComponent } from './organisateur/create-event/create-event.component';
import { DashboardOrgComponent } from './organisateur/dashboard-org/dashboard-org.component';
import { ReservationLocalComponent } from './organisateur/reservation-local/reservation-local.component';
import { EventListComponent } from './participant/event-list/event-list.component';
import { authGuard } from './guard/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"category",component:ListCategoryComponent},
  {path:"local",component:ListLocalComponent},
  {path:"users",component:ListUsersComponent},
  {path:"events",component:ListEventsComponent},
  {path:"signup",component:SignupComponent},
  {path: "admin-dashboard",component:DashboardAdminComponent ,canActivate: [authGuard]},
  {path: "create-event",component:CreateEventComponent },
   {path:"dashboard-org",component:DashboardOrgComponent, canActivate: [authGuard]},
   {path: "reservation-local", component: ReservationLocalComponent },
   {path: "event-list", component: EventListComponent },
     { path: '**', redirectTo: '' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }