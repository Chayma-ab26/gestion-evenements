import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-participant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-participant.component.html',
  styleUrl: './list-participant.component.css'
})
export class ListParticipantComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  participants: any[] = [];
  isLoading = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        this.events = events || [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  selectEvent(event: any) {
    if (event && event.target) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedIndex = selectElement.selectedIndex;
      if (selectedIndex > 0) { // Skip the first option which is "-- Sélectionner --"
        const selectedEvent = this.events[selectedIndex - 1];
        this.selectedEvent = selectedEvent;
/*         this.loadParticipants(selectedEvent.id);
 */      }
    }
  }

  /*loadParticipants(eventId: string) {
    this.isLoading = true;
    this.eventService.getParticipants(eventId).subscribe({
      next: (list: any[]) => {
        this.participants = list || [];
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // Computed properties for template
  get eventCapacity(): string | number {
    if (!this.selectedEvent) return 'Non définie';
    return this.selectedEvent.maxParticipants || this.selectedEvent.capacity || this.selectedEvent.nbParticipants || 'Non définie';
  }

  get approvedCount(): number {
    return this.participants.filter(p => p.status === 'APPROVED').length;
  }

  canApproveMore(): boolean {
    if (!this.selectedEvent) return false;
    const max = this.selectedEvent.maxParticipants || this.selectedEvent.capacity || this.selectedEvent.nbParticipants || 0;
    if (!max) return true; // no limit provided
    return this.approvedCount < max;
  }

  approve(participant: any) {
    if (!this.canApproveMore()) {
      Swal.fire('Limite atteinte', 'Le nombre maximal de participants approuvés est atteint.', 'warning');
      return;
    }

    this.eventService.approveParticipant(this.selectedEvent.id + '', participant.id + '').subscribe({
      next: () => {
        Swal.fire('Accepté', 'Le participant a été accepté.', 'success');
        this.loadParticipants(this.selectedEvent.id + '');
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Impossible d\'accepter le participant', 'error');
      }
    });
  }

  reject(participant: any) {
    this.eventService.rejectParticipant(this.selectedEvent.id + '', participant.id + '').subscribe({
      next: () => {
        Swal.fire('Refusé', 'Le participant a été refusé.', 'success');
        this.loadParticipants(this.selectedEvent.id + '');
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.message || 'Impossible de refuser le participant', 'error');
      }
    });
  }
}
 */
}