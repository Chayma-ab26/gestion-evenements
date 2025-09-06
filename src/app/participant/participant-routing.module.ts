import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantDashboardComponent } from './participant-dashboard/participant-dashboard.component';
import { EventListComponent } from './event-list/event-list.component';

import { RoleGuard } from '../guard/role.guard';
const routes: Routes = [
  { path: 'dashboard', component: ParticipantDashboardComponent, canActivate: [RoleGuard], data: { roles: ['participant'] } },
  { path: 'event-list', component: EventListComponent, canActivate: [RoleGuard], data: { roles: ['participant'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantRoutingModule {}
