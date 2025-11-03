import { Component, NgZone, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { AvisService, Avis } from '../../services/avis.service';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ReservationService } from '../../services/reservation.service';
import { Router } from '@angular/router';
import { KeycloakService } from '../../services/keycloak.service';
import { FormsModule } from '@angular/forms';
import { HeaderPartComponent } from '../header-part/header-part.component';
import { StripeService } from '../../services/stripe.service';
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

  // Propriétés pour avis et rating
  newCommentaire: { [eventId: number]: string } = {};
  newRating: { [eventId: number]: number } = {};
  hoverRating: { [eventId: number]: number } = {};
  selectedImageIndex: { [eventId: number]: number } = {};
  avisParEvent: { [key: number]: any[] } = {};
 
  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private localService: LocalService,
    private avisService: AvisService,
    private reservationService: ReservationService,
    private ngzone: NgZone,
    private router: Router,
    private keycloakService: KeycloakService,
    private http: HttpClient,
  private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // Chargement des données
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
        averageRating: eventAvis.length > 0
          ? eventAvis.reduce((sum, avis) => sum + avis.note, 0) / eventAvis.length
          : 0,
        totalReviews: eventAvis.length
      };
    });
  }

  // ✅ Correction ici : accepte 3 paramètres cohérents avec ton HTML
 submitAvis(eventId: number, note: number, commentaire: string) {
  if (!note || !commentaire) {
    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Veuillez noter et commenter avant d\'envoyer votre avis.',
      confirmButtonColor: '#f39c12'
    });
    return;
  }

  const avis = { eventId, note, commentaire };

  console.log("🔹 Envoi de l'avis :", avis);

  this.http.post('http://localhost:8070/avis/create', avis).subscribe({
    next: (response: any) => {
      console.log("✅ Avis créé sur le backend :", response);

      Swal.fire({
        icon: 'success',
        title: 'Merci !',
        text: 'Votre avis a été enregistré avec succès.',
        confirmButtonColor: '#28a745'
      });

      // 🔹 Trouver l'événement correspondant
      const event = this.filteredEvents.find(e => e.id === eventId);

      if (event) {
        // 🔹 Créer la liste des avis si elle n'existe pas
        if (!event.avis) {
          event.avis = [];
        }

        // 🔹 Ajouter l’avis localement (pour affichage immédiat)
        const nouvelAvis = {
          note: avis.note,
          commentaire: avis.commentaire,
          idTemp: Date.now() // identifiant temporaire
        };

        event.avis.unshift(nouvelAvis);
        event.totalReviews = event.avis.length;
        event.averageRating = event.avis.reduce((sum: number, a: any) => sum + a.note, 0) / event.avis.length;

        // 🔹 Réinitialiser les champs du formulaire
        this.newCommentaire[eventId] = '';
        this.newRating[eventId] = 0;
      } else {
        console.warn("⚠️ Aucun événement trouvé avec l'id :", eventId);
      }
    },
    
  });
  
      Swal.fire({
        icon: 'success',
        title: 'Merci !',
        text: 'Votre avis a été enregistré avec succès.',
        confirmButtonColor: '#28a745'
      });
}



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
              text: 'Votre réservation a été enregistrée.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745'
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Erreur',
              text: 'Impossible d\'enregistrer votre participation.',
              icon: 'error',
              confirmButtonColor: '#e74c3c'
            });
          }
        });
      }
    });
  }

  // Méthodes utilitaires images et infos
  selectImage(eventId: number, index: number) {
    this.selectedImageIndex[eventId] = index;
  }

  getMainImage(event: any): string {
    const images = this.getLocalImages(event);
    if (images.length === 0) return '';
    const index = this.selectedImageIndex[event.id] || 0;
    return `api/locals/files/${images[index]}`;
  }

  getLocalImages(event: any): string[] {
    const local = event.local || this.locals.find(l => l.id === event.localId);
    return local?.images || [];
  }

  getLocalName(event: any): string {
    const local = event.local || this.locals.find(l => l.id === event.localId);
    return local?.name || 'Nom du lieu manquant';
  }

  trackByEventId(index: number, event: any): any {
    return event ? event.id : undefined;
  }

viewDetails(event: any) {
  Swal.fire({
    title: event.title,
    html: `
      <strong>Description :</strong> ${event.description}<br>
      <strong>Lieu :</strong> ${this.getLocalName(event)}<br>
      <strong>Date :</strong> ${new Date(event.date).toLocaleDateString()}
    `,
    imageUrl: this.getMainImage(event),
    imageWidth: 300,
    imageAlt: event.title,
    confirmButtonText: 'Fermer',
    confirmButtonColor: '#3498db'
  });
}




}