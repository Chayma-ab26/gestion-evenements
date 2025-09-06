import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantRoutingModule } from './participant-routing.module';
import { ParticipantDashboardComponent } from './participant-dashboard/participant-dashboard.component';
import { EventListComponent } from './event-list/event-list.component';

@NgModule({
  imports: [
    CommonModule,
    ParticipantRoutingModule
  ],
  declarations: [], // Standalone components, so no need to declare
})
export class ParticipantModule {}
