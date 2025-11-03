import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservationService } from '../../services/reservation.service';
import { KeycloakService } from '../../services/keycloak.service';
import { Reservation } from '../../models/reservation.model';
import Swal from 'sweetalert2';
import { HeaderPartComponent } from '../header-part/header-part.component';
import { StripeService } from '../../services/stripe.service';
import { HttpClientModule } from '@angular/common/http';
import { loadStripe,Stripe } from '@stripe/stripe-js';



declare const Stripe: any;
// Interface étendue pour inclure les données de l'événement
interface ReservationWithEvent extends Reservation {
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  eventImage?: string;
  participantName?: string;
}

@Component({
  selector: 'app-mes-reservations',
  standalone: true,
  imports: [CommonModule, HeaderPartComponent], // ← HttpClientModule supprimé
  templateUrl: './mes-reservations.component.html',
  styleUrl: './mes-reservations.component.css'
})
export class MesReservationsComponent implements OnInit {
  reservations: ReservationWithEvent[] = [];
  filteredReservations: ReservationWithEvent[] = [];
  isLoading = false;
  currentFilter = 'all';

  // Filtres disponibles
  filters = [
    { value: 'all', label: 'Toutes', icon: 'fas fa-list' },
    { value: 'confirmed', label: 'Confirmées', icon: 'fas fa-check-circle' },
    { value: 'pending', label: 'En attente', icon: 'fas fa-clock' },
    { value: 'cancelled', label: 'Annulées', icon: 'fas fa-times-circle' },
    { value: 'upcoming', label: 'À venir', icon: 'fas fa-calendar-alt' },
    { value: 'past', label: 'Passées', icon: 'fas fa-history' }
  ];

  constructor(
    private reservationService: ReservationService,
    private keycloakService: KeycloakService,
    private router: Router,
    private stripeService: StripeService
  ) {}

  ngOnInit() {
    console.log('🔄 MesReservationsComponent initialisé');
    
    // Vérifier si Keycloak est initialisé
    if (!this.isKeycloakReady()) {
      this.handleKeycloakNotReady();
      return;
    }

    // Vérifier si l'utilisateur est connecté
    if (!this.keycloakService.isLoggedIn()) {
      this.handleNotLoggedIn();
      return;
    }
    
    this.loadReservations();
  }

  private isKeycloakReady(): boolean {
    const token = this.keycloakService.getToken();
    const isReady = !!token;
    console.log('🔐 Keycloak prêt:', isReady);
    return isReady;
  }

  private handleKeycloakNotReady() {
    console.log('⏳ Keycloak non prêt, réessai...');
    Swal.fire({
      title: 'Initialisation en cours',
      text: 'Veuillez patienter pendant l\'initialisation...',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    });
  }

  private handleNotLoggedIn() {
    console.log('🔒 Utilisateur non connecté');
    Swal.fire({
      title: 'Connexion requise',
      text: 'Vous devez être connecté pour voir vos réservations',
      icon: 'warning',
      confirmButtonText: 'Se connecter',
      cancelButtonText: 'Annuler',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.safeLogin();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private safeLogin() {
    try {
      this.keycloakService.login();
    } catch (error) {
      console.error('❌ Erreur lors du login:', error);
      Swal.fire('Erreur', 'Impossible de se connecter. Veuillez rafraîchir la page.', 'error');
    }
  }

  loadReservations() {
    this.isLoading = true;
    console.log('🔄 Début du chargement des réservations');

    const currentUserId = this.getUserId();
    const currentUsername = this.getUsername();

    if (!currentUserId) {
      console.error('❌ ID utilisateur non trouvé');
      Swal.fire('Erreur', 'Impossible d\'identifier l\'utilisateur', 'error');
      this.isLoading = false;
      return;
    }

    console.log('🔍 Chargement des réservations pour utilisateur:', {
      userId: currentUserId,
      username: currentUsername
    });

    // TESTEZ D'ABORD my-reservations (utilise l'authentification automatique)
    this.reservationService.getMyReservations().subscribe({
      next: (reservations: Reservation[]) => {
        console.log('✅ Réservations réelles chargées (my-reservations):', reservations);
        this.processReservations(reservations, currentUserId, currentUsername, false);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur avec my-reservations:', error);
        
        // FALLBACK: utiliser l'endpoint user
        this.reservationService.getReservationsByUser(currentUserId).subscribe({
          next: (reservations: Reservation[]) => {
            console.log('✅ Réservations réelles chargées (user):', reservations);
            this.processReservations(reservations, currentUserId, currentUsername, false);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('❌ Erreur avec user/:id:', error);
            
            // DERNIER FALLBACK: utiliser getAllReservations
            this.fallbackToGetAll(currentUserId, currentUsername);
          }
        });
      }
    });
  }

  // MAINTENANT CETTE MÉTHODE EST APPELLÉE
  private fallbackToGetAll(currentUserId: string, currentUsername: string) {
    console.log('🔄 Fallback: utilisation de getAllReservations');
    
    this.reservationService.getAllReservations().subscribe({
      next: (allReservations: any[]) => {
        console.log('📦 Toutes les réservations récupérées:', allReservations);
        
        // Filtrer pour ne garder que les réservations de l'utilisateur connecté
        const userReservations = allReservations.filter(reservation => 
          reservation.userKeycloakId === currentUserId
        );
        
        console.log('👤 Réservations filtrées pour l\'utilisateur:', userReservations);
        this.processReservations(userReservations, currentUserId, currentUsername, false);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur même avec getAllReservations:', error);
        Swal.fire('Erreur', 'Impossible de charger vos réservations', 'error');
        this.isLoading = false;
      }
    });
  }

  private processReservations(reservations: any[], currentUserId: string, currentUsername: string, isMock: boolean = false) {
    console.log(`📊 Traitement de ${reservations.length} réservations (${isMock ? 'mock' : 'réelles'})`);
    
    // Filtrer les réservations de l'utilisateur connecté
    this.reservations = reservations
      .filter(reservation => {
        const isUserReservation = reservation.userKeycloakId === currentUserId;
        return isUserReservation;
      })
      .map(reservation => this.mapReservationData(reservation, currentUsername));
    
    console.log('✅ Réservations filtrées:', this.reservations);
    
    this.applyFilter(this.currentFilter);
    this.isLoading = false;
  }

  private getUserId(): string | null {
    const token = this.keycloakService.getToken();
    if (!token) return null;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.sub || null;
    } catch (error) {
      console.error('❌ Erreur décodage token:', error);
      return null;
    }
  }

  private getUsername(): string {
    const username = this.keycloakService.getUsername();
    if (username) return username;

    const token = this.keycloakService.getToken();
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        return tokenPayload.preferred_username || tokenPayload.name || tokenPayload.email || 'Utilisateur';
      } catch (error) {
        console.error('❌ Erreur décodage token pour username:', error);
      }
    }

    return 'Utilisateur';
  }

  private mapReservationData(reservation: any, username: string): ReservationWithEvent {
    return {
      id: reservation.id,
      eventId: reservation.eventId,
      eventTitle: reservation.eventTitle || `Événement #${reservation.eventId}`,
      eventDate: reservation.eventDate || new Date().toISOString(),
      eventLocation: reservation.eventLocation || 'Lieu non spécifié',
      eventImage: reservation.eventImage || 'assets/default-event.jpg',
      nbParticipants: reservation.nbParticipants || 1,
      status: reservation.status || 'PENDING',
      reservationDate: reservation.reservationDate || new Date().toISOString(),
      Prix: reservation.Prix || 0,
      userKeycloakId: reservation.userKeycloakId,
      participantName: username
    };
  }

  applyFilter(filter: string) {
    this.currentFilter = filter;
    const now = new Date();
    
    switch (filter) {
      case 'all':
        this.filteredReservations = this.reservations;
        break;
      case 'confirmed':
        this.filteredReservations = this.reservations.filter(r => r.status === 'CONFIRMED');
        break;
      case 'pending':
        this.filteredReservations = this.reservations.filter(r => r.status === 'PENDING');
        break;
      case 'cancelled':
        this.filteredReservations = this.reservations.filter(r => r.status === 'CANCELLED');
        break;
      case 'upcoming':
        this.filteredReservations = this.reservations.filter(r => 
          r.eventDate && new Date(r.eventDate) > now && r.status !== 'CANCELLED'
        );
        break;
      case 'past':
        this.filteredReservations = this.reservations.filter(r => 
          r.eventDate && new Date(r.eventDate) < now
        );
        break;
      default:
        this.filteredReservations = this.reservations;
    }
  }

  getStatusBadgeClass(status: string = ''): string {
    switch (status) {
      case 'CONFIRMED':
        return 'status-badge confirmed';
      case 'PENDING':
        return 'status-badge pending';
      case 'CANCELLED':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  }

  getStatusText(status: string = ''): string {
    switch (status) {
      case 'CONFIRMED':
        return 'Payé';
      case 'PENDING':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status || 'Inconnu';
    }
  }

  viewEventDetails(eventId: number) {
    this.router.navigate(['/event-details', eventId]);
  }

  cancelReservation(reservation: ReservationWithEvent) {
    if (!reservation.id) {
      Swal.fire('Erreur', 'ID de réservation manquant', 'error');
      return;
    }

    if (reservation.status === 'CANCELLED') {
      Swal.fire('Info', 'Cette réservation est déjà annulée', 'info');
      return;
    }

    if (reservation.eventDate && this.isEventPast(reservation.eventDate)) {
      Swal.fire('Info', 'Impossible d\'annuler une réservation passée', 'info');
      return;
    }

    Swal.fire({
      title: 'Annuler la réservation',
      text: `Êtes-vous sûr de vouloir annuler votre réservation pour "${reservation.eventTitle}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, annuler',
      cancelButtonText: 'Non, garder',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        // Essayer d'annuler via le service réel
        this.reservationService.updateStatus(reservation.id!, 'CANCELLED').subscribe({
          next: () => {
            Swal.fire('Succès!', 'Votre réservation a été annulée', 'success');
            this.loadReservations(); // Recharger les réservations
          },
          error: (error) => {
            console.error('Erreur lors de l\'annulation:', error);
            Swal.fire('Erreur', 'Impossible d\'annuler la réservation', 'error');
          }
        });
      }
    });
  }

  downloadTicket(reservation: ReservationWithEvent) {
    Swal.fire('Info', 'Fonctionnalité de téléchargement du billet à implémenter', 'info');
  }

  formatDate(dateString: string = ''): string {
    if (!dateString) return 'Date non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  }

  getTotalReservations(): number {
    return this.reservations.length;
  }

  getUpcomingReservations(): number {
    const now = new Date();
    return this.reservations.filter(r => 
      r.eventDate && new Date(r.eventDate) > now && r.status !== 'CANCELLED'
    ).length;
  }

  getTotalAmount(): number {
    return this.reservations.reduce((total, reservation) => total + (reservation.Prix || 0), 0);
  }

  goToEvents() {
    this.router.navigate(['/event-list']);
  }

  // Méthodes utilitaires pour les dates dans le template
  isEventPast(eventDate: string = ''): boolean {
    if (!eventDate) return false;
    return new Date(eventDate) < new Date();
  }

  isEventUpcoming(eventDate: string = ''): boolean {
    if (!eventDate) return false;
    return new Date(eventDate) > new Date();
  }

  // Méthode pour rafraîchir les réservations
  refreshReservations() {
    this.loadReservations();
  }

  async payReservation(reservation: ReservationWithEvent) {
  if (!reservation.id) {
    Swal.fire('Erreur', 'ID de réservation manquant', 'error');
    return;
  }

  try {
    const response = await this.stripeService.createCheckoutSession(reservation.id).toPromise();
    if (response.url) {
      window.location.href = response.url;  // Redirect to Stripe Checkout
    } else {
      Swal.fire('Erreur', 'URL de paiement non reçue', 'error');
    }
  } catch (err: any) {
    console.error('Erreur création session Stripe', err);
    let message = 'Impossible de créer la session de paiement.';
    if (err.status === 404 && err.error?.error?.includes('Événement introuvable')) {
      message = `Événement associé (ID ${reservation.eventId}) non trouvé. Vérifiez les données de l'événement ou contactez l'admin.`;
    }
    Swal.fire('Erreur', message, 'error');
  }
}

  getStatusIcon(status: string): string {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return 'fas fa-check-circle';
    case 'PENDING':
      return 'fas fa-clock';
    case 'CANCELLED':
      return 'fas fa-times-circle';
    default:
      return 'fas fa-question-circle';
  }
}
/* 
getStatusText(status: string): string {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return 'Confirmée';
    case 'PENDING':
      return 'En attente';
    case 'CANCELLED':
      return 'Annulée';
    default:
      return 'Inconnu';
  }
} */
}
