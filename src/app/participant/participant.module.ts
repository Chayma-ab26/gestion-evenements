import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantRoutingModule } from './participant-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ParticipantRoutingModule
  ],
    exports: [RouterModule],

  declarations: [], 
})
export class ParticipantModule {}
