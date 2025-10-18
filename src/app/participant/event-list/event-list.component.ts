import { Component, NgZone, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { AvisService, Avis } from '../../services/avis.service';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderOrgComponent } from '../../organisateur/header-org/header-org.component';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { KeycloakService } from '../../services/keycloak.service';
import { FormsModule } from '@angular/forms';
import { HeaderPartComponent } from '../header-part/header-part.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [HeaderPartComponent, FooterComponent, CommonModule, HttpClientModule, FormsModule]
})
export class EventListComponent implements OnInit {
  listevents: any[] = [];
  filteredEvents: any[] = [];
  categories: any[] = [];
  locals: any[] = [];
  avisList: Avis[] = [];
  isLoading = true;
  selectedRating = 0;

selectedEventId: number | null = null;
note: number = 0;
commentaire: string = '';
  // 🔹 Propriétés manquantes corrigées
  newCommentaire: { [eventId: number]: string } = {};
  newRating: { [eventId: number]: number } = {};
  hoverRating: { [eventId: number]: number } = {};
  selectedImageIndex: { [eventId: number]: number } = {};

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private localService: LocalService,
    private avisService: AvisService,
    private reservationService: ReservationService,
    private ngzone: NgZone,
    private router: Router,
    private keycloakService: KeycloakService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  // 📌 Gestion images
  selectImage(eventId: number, index: number) {
    this.selectedImageIndex[eventId] = index;
  }

  getMainImage(event: any): string {
    const images = this.getLocalImages(event);
    if (images.length === 0) return '';
    const index = this.selectedImageIndex[event.id] || 0;
    return `api/locals/files/${images[index]}`;
  }

  // 🔹 Chargement des données
  loadData() {
    this.isLoading = true;

    forkJoin({
      categories: this.categoryService.getAll() as Observable<any[]>,
      locals: this.localService.getAll() as Observable<any[]>,
      events: this.eventService.getAll() as Observable<any[]>,
    }).subscribe({
      next: (data) => {
        this.categories = data.categories || [];
        this.locals = data.locals || [];
        this.listevents = data.events || [];

        this.enrichEvents();
        this.associateAvis();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
      }
    });
  }

  enrichEvents() {
    this.filteredEvents = this.listevents.map(event => {
      const category = this.categories.find(c => c.id == event.categoryId);
      const local = this.locals.find(l => l.id == event.localId);

      let imagesArray: string[] = [];
      if (local && typeof local.image === 'string') {
        try {
          imagesArray = JSON.parse(local.image);
        } catch (e) {
          console.error('Erreur parsing images JSON:', e);
        }
      }

      return {
        ...event,
        category: category || null,
        local: local ? { ...local, images: imagesArray } : null
      };
    });
  }

  associateAvis() {
    this.filteredEvents = this.filteredEvents.map(event => {
      const eventAvis = this.avisList.filter(avis => avis.eventId === event.id);
      return {
        ...event,
        avis: eventAvis,
        averageRating: eventAvis.length > 0 ? eventAvis.reduce((sum, avis) => sum + avis.note, 0) / eventAvis.length : 0,
        totalReviews: eventAvis.length
      };
    });
  }

  // 🔹 Participer à un événement
  participateEvent(eventId: number) {
    Swal.fire({
      title: 'Confirmer la participation',
      text: 'Voulez-vous vraiment participer à cet événement ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, participer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#4361ee',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservationService.createEventReservation(eventId, 1).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Participation confirmée !',
              html: `
                <div class="success-reservation">
                  <i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem;"></i>
                  <h4>Réservation réussie</h4>
                  <p>Votre participation à l'événement a été enregistrée.</p>
                  <p><strong>Statut:</strong> ${response.status || 'En attente'}</p>
                  <p><strong>Référence:</strong> ${response.id ? `RES-${response.id}` : 'Génération en cours'}</p>
                </div>
              `,
              icon: 'success',
              confirmButtonText: 'Parfait !',
              confirmButtonColor: '#28a745'
            });
          },
          error: (error) => {
            let errorMessage = 'Une erreur est survenue lors de la réservation.';
            if (error.status === 400) errorMessage = 'Données de réservation invalides.';
            if (error.status === 409) errorMessage = 'Vous participez déjà à cet événement.';
            if (error.status === 404) errorMessage = 'Événement non trouvé.';
            if (error.status === 0) errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
            
            Swal.fire({
              title: 'Erreur',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#ef233c'
            });
          }
        });
      }
    });
  }

  // 🔹 Avis / notation
 submitAvis(eventId: number, note: number, commentaire: string) {
  const avisData = {
    commentaire: commentaire,
    note: note,
    eventId: eventId
  };

  this.http.post('http://localhost:8070/avis/create', avisData, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: (response) => {
      console.log('Avis envoyé avec succès:', response);
      Swal.fire({
        title: 'Merci pour votre avis !',
        text: 'Votre avis a été soumis avec succès.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      // Clear the inputs for this event
      this.newCommentaire[eventId] = '';
      this.newRating[eventId] = 0;
      // Reload avis for the event
      this.loadAvisForEvent(eventId);
    },
    error: (err) => {
      console.error('Erreur lors de l\'envoi de l\'avis:', err);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'envoi de l\'avis.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}

  loadAvisForEvent(eventId: number) {
    this.avisService.getAvisByEvent(eventId).subscribe({
      next: (avisList) => {
        const eventIndex = this.filteredEvents.findIndex(e => e.id === eventId);
        if (eventIndex >= 0) {
          this.filteredEvents[eventIndex].avis = avisList;
          this.filteredEvents[eventIndex].averageRating = avisList.length > 0
            ? avisList.reduce((sum, a) => sum + a.note, 0) / avisList.length
            : 0;
          this.filteredEvents[eventIndex].totalReviews = avisList.length;
        }
      }
    });
  }

  // 🔹 Méthode pour le paiement
  payOnline(event: any) {
    Swal.fire({
      title: 'Paiement en ligne',
      text: `Vous allez payer pour l'événement "${event.title}"`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }

  // 🔹 Méthodes utilitaires
  getLocalById(localId: number): any {
    return this.locals.find(l => l.id === localId);
  }

  hasImage(event: any): boolean {
    const local = event.local || this.getLocalById(event.localId);
    return local && local.images && Array.isArray(local.images) && local.images.length > 0;
  }

  getImageUrl(event: any): string {
    const local = event.local || this.getLocalById(event.localId);
    return this.hasImage(event) ? `api/locals/files/${local.images[0]}` : '';
  }

  getLocalName(event: any): string {
    const local = event.local || this.getLocalById(event.localId);
    return local?.name || 'Nom du lieu manquant';
  }

  getLocalImages(event: any): string[] {
    const local = event.local || this.getLocalById(event.localId);
    return local?.images || [];
  }

  getCategoryName(event: any): string {
    return event.category?.name || 'Nom de catégorie manquant';
  }

  trackByEventId(index: number, event: any): any {
    return event ? event.id : undefined;
  }
}
