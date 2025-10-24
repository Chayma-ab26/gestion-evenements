import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { HeaderOrgComponent } from '../header-org/header-org.component';
import { RouterModule } from '@angular/router'; 

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-participant',
  standalone: true,
  imports: [CommonModule,HeaderOrgComponent,RouterModule ],
  templateUrl: './list-participant.component.html',
  styleUrl: './list-participant.component.css'
})
export class ListParticipantComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  reservations: any[] = [];
  isLoading = false;

  constructor(
    private eventService: EventService,
    private reservationService: ReservationService,
    private userService: UserService // Injection du service user
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        console.log('Événements chargés:', events);
        this.events = events || [];
        this.isLoading = false;
      },
      error: (error: any) => { 
        console.error('Erreur chargement événements:', error);
        this.isLoading = false; 
        Swal.fire('Erreur', 'Impossible de charger les événements', 'error');
      }
    });
  }

  selectEvent(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    const eventId = selectElement.value;
    
    if (eventId) {
      const selectedEvent = this.events.find(ev => ev.id == eventId);
      if (selectedEvent) {
        this.selectedEvent = selectedEvent;
        this.loadReservationsWithUserInfo(selectedEvent.id); // Nouvelle méthode
      }
    } else {
      this.selectedEvent = null;
      this.reservations = [];
    }
  }

  // NOUVELLE MÉTHODE : Charger les réservations avec les infos utilisateur
  loadReservationsWithUserInfo(eventId: string): void {
    this.isLoading = true;
    
    this.reservationService.getByEvent(eventId).subscribe({
      next: (reservations: any[]) => {
        console.log('Réservations chargées:', reservations);
        
        if (reservations.length === 0) {
          this.reservations = [];
          this.isLoading = false;
          Swal.fire('Info', 'Aucune réservation trouvée pour cet événement', 'info');
          return;
        }

        // Pour chaque réservation, charger les infos utilisateur
        let completedRequests = 0;
        const totalReservations = reservations.length;

        reservations.forEach((reservation, index) => {
          const userId = reservation.userId || reservation.user?.id;
          
          if (userId) {
            this.userService.getById(userId).subscribe({
              next: (userData: any) => {
                // Fusionner les données utilisateur avec la réservation
                reservation.user = userData;
                completedRequests++;
                
                // Quand toutes les requêtes sont terminées
                if (completedRequests === totalReservations) {
                  this.reservations = reservations;
                  this.isLoading = false;
                  console.log('Toutes les données utilisateur chargées:', this.reservations);
                }
              },
              error: (error) => {
                console.error(`Erreur chargement user ${userId}:`, error);
                // Données par défaut en cas d'erreur
                reservation.user = { 
                  id: userId, 
                  firstname: 'Erreur', 
                  lastname: 'Chargement',
                  phone: 'Non disponible' 
                };
                completedRequests++;
                
                if (completedRequests === totalReservations) {
                  this.reservations = reservations;
                  this.isLoading = false;
                }
              }
            });
          } else {
            // Pas de userId, on passe à la suivante
            completedRequests++;
            if (completedRequests === totalReservations) {
              this.reservations = reservations;
              this.isLoading = false;
            }
          }
        });
      },
      error: (error: any) => {
        console.error('Erreur chargement réservations:', error);
        this.isLoading = false;
        Swal.fire('Erreur', 'Impossible de charger les réservations', 'error');
      }
    });
  }

  approve(reservation: any): void {
    if (!this.canApproveMore()) {
      Swal.fire('Limite atteinte', 'Le nombre maximal de participants approuvés est atteint.', 'warning');
      return;
    }

    const reservationId = Number(reservation.id);
    
    Swal.fire({
      title: 'Confirmer l\'approbation',
      text: `Voulez-vous vraiment approuver la réservation de ${this.getUserFullName(reservation)} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, approuver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.approve(reservationId).subscribe({
          next: () => {
            Swal.fire('Accepté', 'La réservation a été acceptée.', 'success');
            this.loadReservationsWithUserInfo(this.selectedEvent.id);
          },
          error: (err: any) => {
            Swal.fire('Erreur', err.error?.message || 'Impossible d\'accepter la réservation', 'error');
          }
        });
      }
    });
  }

  reject(reservation: any): void {
    const reservationId = Number(reservation.id);
    
    Swal.fire({
      title: 'Confirmer le rejet',
      text: `Voulez-vous vraiment rejeter la réservation de ${this.getUserFullName(reservation)} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, rejeter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.reject(reservationId).subscribe({
          next: () => {
            Swal.fire('Refusé', 'La réservation a été refusée.', 'success');
            this.loadReservationsWithUserInfo(this.selectedEvent.id);
          },
          error: (err: any) => {
            Swal.fire('Erreur', err.error?.message || 'Impossible de refuser la réservation', 'error');
          }
        });
      }
    });
  }

  // MÉTHODES UTILITAIRES POUR RÉCUPÉRER LES INFOS
  get eventCapacity(): string | number {
    if (!this.selectedEvent) return 'Non définie';
    return this.selectedEvent.maxParticipants || this.selectedEvent.capacity || this.selectedEvent.nbParticipants || 'Non définie';
  }

  get approvedCount(): number {
    return this.reservations.filter(r => r.status === 'APPROVED').length;
  }

  canApproveMore(): boolean {
    if (!this.selectedEvent) return false;
    const max = this.selectedEvent.maxParticipants || this.selectedEvent.capacity || this.selectedEvent.nbParticipants || 0;
    if (!max || typeof max !== 'number') return true;
    return this.approvedCount < max;
  }

  // Récupérer le nom complet
  getUserFullName(reservation: any): string {
    const user = reservation.user;
    if (!user) return 'Utilisateur inconnu';
    
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    } else if (user.name) {
      return user.name;
    } else if (user.username) {
      return user.username;
    }
    
    return 'Utilisateur inconnu';
  }

  // Récupérer le prénom
  getUserFirstName(reservation: any): string {
    return reservation.user?.firstname || reservation.user?.name || 'Inconnu';
  }

  // Récupérer le nom
  getUserLastName(reservation: any): string {
    return reservation.user?.lastname || '';
  }

  // Récupérer le téléphone
  getUserPhone(reservation: any): string {
    return reservation.user?.phone || reservation.user?.telephone || reservation.user?.phoneNumber || 'Non disponible';
  }

 
  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'PENDING': 'En attente',
      'APPROVED': 'Approuvé',
      'REJECTED': 'Rejeté'
    };
    return statusMap[status] || status;
  }
}