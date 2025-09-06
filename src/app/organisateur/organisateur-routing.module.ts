
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardOrgComponent } from './dashboard-org/dashboard-org.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { ReservationLocalComponent } from './reservation-local/reservation-local.component';
import { ListParticipantComponent } from './list-participant/list-participant.component';

import { RoleGuard } from '../guard/role.guard';
const routes: Routes = [
  { path: 'dashboard', component: DashboardOrgComponent, canActivate: [RoleGuard], data: { roles: ['organisateur'] } },
  { path: 'create-event', component: CreateEventComponent, canActivate: [RoleGuard], data: { roles: ['organisateur'] } },
  { path: 'reservation-local', component: ReservationLocalComponent, canActivate: [RoleGuard], data: { roles: ['organisateur'] } },
  { path: 'list-participant', component: ListParticipantComponent, canActivate: [RoleGuard], data: { roles: ['organisateur'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisateurRoutingModule { }
