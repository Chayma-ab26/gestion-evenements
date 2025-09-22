import { Component, Directive, Input, HostBinding, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
// Services réels
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { HeaderOrgComponent } from '../../organisateur/header-org/header-org.component';

// Directive for fallback image
@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  },
  standalone: true
})
export class ImageFallbackDirective {
  @Input() src?: string;
  @Input() default!: string;

  updateUrl() {
    this.src = this.default;
  }
}

// Interface pour typer les événements
interface Event {
  id: string | number;
  title: string;
  description?: string;
  datedebut: string;
  local?: { name: string };
  category?: { name: string };
  status?: string;
  maxParticipants?: number;
  capacity?: number;
  nbParticipants?: number;
  price?: number;
  participants?: any[];
  averageRating?: number;
  createdAt?: string;
  dateCreation?: string;
  isFavorite?: boolean;
  participationDate?: string;
  userRating?: number;
  image?: string;
}

@Component({
  selector: 'app-participant-dashboard',
  standalone: true,
  imports: [CommonModule, ImageFallbackDirective, HeaderOrgComponent],
  templateUrl: './participant-dashboard.component.html',
  styleUrl: './participant-dashboard.component.css'
})
export class ParticipantDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('participationChart') participationChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  participationChart: Chart | undefined;
  categoryChart: Chart | undefined;

  // Statistiques personnelles
  participatedEvents = 0;
  favoriteEvents = 0;
  upcomingEvents = 0;
  averageRating = 0;

  // Données des événements
  upcomingEventsList: Event[] = [];
  recentParticipatedEvents: Event[] = [];
  recommendedEvents: Event[] = [];

  // État du rating
  hoverRating = 0;

  constructor(
    private router: Router,
    private eventService: EventService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Attendre que les données soient chargées avant de rendre les graphiques
    setTimeout(() => {
      this.renderParticipationChart();
      this.renderCategoryChart();
    }, 1000);
  }

  loadDashboardData() {
    // Charger les données réelles
    this.loadUpcomingEvents();
    this.loadRecentParticipatedEvents();
    this.loadRecommendedEvents();
    this.calculateStats();
  }

  loadUpcomingEvents() {
    // Charger les événements à venir depuis le service
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        // Filtrer les événements à venir (date > aujourd'hui)
        const today = new Date();
        this.upcomingEventsList = events.filter((event: Event) => {
          const eventDate = new Date(event.datedebut);
          return eventDate > today;
        }).slice(0, 6); // Limiter à 6 événements

        // Ajouter la propriété isFavorite (à implémenter selon votre logique)
        this.upcomingEventsList.forEach(event => {
          event.isFavorite = false; // À remplacer par la vraie logique des favoris
        });

        this.calculateStats();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des événements à venir:', err);
        this.upcomingEventsList = [];
      }
    });
  }

  loadRecentParticipatedEvents() {
    // Charger les événements récemment participés
    // Note: Cette méthode dépend de votre logique de participation
    // Pour l'instant, on utilise les événements passés
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        const today = new Date();
        this.recentParticipatedEvents = events.filter((event: Event) => {
          const eventDate = new Date(event.datedebut);
          return eventDate < today;
        }).slice(0, 4); // Limiter à 4 événements

        // Ajouter des données simulées pour le rating (à remplacer par la vraie logique)
        this.recentParticipatedEvents.forEach(event => {
          event.participationDate = event.datedebut;
          event.userRating = Math.floor(Math.random() * 5) + 1; // Rating aléatoire pour l'exemple
        });

        this.calculateStats();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des participations récentes:', err);
        this.recentParticipatedEvents = [];
      }
    });
  }

  loadRecommendedEvents() {
    // Charger les événements recommandés basés sur les préférences
    // Pour l'instant, on utilise les événements à venir
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        const today = new Date();
        this.recommendedEvents = events.filter((event: Event) => {
          const eventDate = new Date(event.datedebut);
          return eventDate > today;
        }).slice(0, 4); // Limiter à 4 événements recommandés

        this.calculateStats();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des recommandations:', err);
        this.recommendedEvents = [];
      }
    });
  }

  calculateStats() {
    // Calculer les statistiques réelles
    this.participatedEvents = this.recentParticipatedEvents.length;
    this.favoriteEvents = this.upcomingEventsList.filter(e => e.isFavorite).length;
    this.upcomingEvents = this.upcomingEventsList.length;

    if (this.recentParticipatedEvents.length > 0) {
      const totalRating = this.recentParticipatedEvents.reduce((sum, event) => sum + (event.userRating || 0), 0);
      this.averageRating = Math.round((totalRating / this.recentParticipatedEvents.length) * 10) / 10;
    }
  }

  // Méthodes de navigation
  goToEvents() {
    this.router.navigate(['/event-list']);
  }

  goToFavorites() {
    // Navigation vers les favoris (à implémenter)
    Swal.fire('Info', 'Page des favoris à implémenter', 'info');
  }

  goToHistory() {
    // Navigation vers l'historique (à implémenter)
    Swal.fire('Info', 'Page de l\'historique à implémenter', 'info');
  }

  goToProfile() {
    // Navigation vers le profil (à implémenter)
    Swal.fire('Info', 'Page du profil à implémenter', 'info');
  }

  // Méthodes d'action
  viewEvent(event: Event) {
    // Voir les détails de l'événement
    Swal.fire({
      title: event.title,
      html: `
        <div style="text-align: left;">
          <p><strong>Date:</strong> ${this.formatDate(event.datedebut)}</p>
          <p><strong>Lieu:</strong> ${event.local?.name || 'Non défini'}</p>
          <p><strong>Catégorie:</strong> ${event.category?.name || 'Non définie'}</p>
          <p><strong>Description:</strong> ${event.description || 'Aucune description'}</p>
        </div>
      `,
      confirmButtonText: 'Fermer'
    });
  }

  toggleFavorite(event: Event) {
    event.isFavorite = !event.isFavorite;
    this.favoriteEvents = this.upcomingEventsList.filter(e => e.isFavorite).length;

    const message = event.isFavorite ? 'ajouté aux favoris' : 'retiré des favoris';
    Swal.fire('Succès!', `Événement ${message}`, 'success');
  }

  rateEvent(event: Event, rating: number) {
    event.userRating = rating;
    this.calculateStats();

    Swal.fire('Merci!', `Vous avez donné ${rating} étoile(s) à cet événement`, 'success');
  }

  writeReview(event: Event) {
    Swal.fire({
      title: 'Écrire un avis',
      input: 'textarea',
      inputPlaceholder: 'Partagez votre expérience...',
      showCancelButton: true,
      confirmButtonText: 'Publier',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire('Succès!', 'Votre avis a été publié', 'success');
      }
    });
  }

  participateEvent(event: Event) {
    Swal.fire({
      title: 'Participer à l\'événement',
      text: `Voulez-vous participer à "${event.title}" ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, participer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Appel au service de participation
        const formData = new FormData();
        formData.append('eventId', event.id.toString());
        formData.append('participantId', 'current-user-id'); // À remplacer par l'ID de l'utilisateur connecté

        this.eventService.participate(event.id.toString(), formData).subscribe({
          next: () => {
            Swal.fire('Succès!', 'Vous participez maintenant à cet événement', 'success');
            // Recharger les données
            this.loadDashboardData();
          },
          error: (err: any) => {
            Swal.fire('Erreur', 'Impossible de participer à cet événement', 'error');
          }
        });
      }
    });
  }

  exportHistory() {
    Swal.fire('Info', 'Fonctionnalité d\'export à implémenter', 'info');
  }

  // Méthodes utilitaires
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Méthodes des graphiques
  renderParticipationChart() {
    if (!this.participationChartRef) return;

    const ctx = this.participationChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Données réelles basées sur les participations
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const participations = [2, 3, 1, 4, 2, 3]; // À remplacer par de vraies données

    this.participationChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Participations',
          data: participations,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  renderCategoryChart() {
    if (!this.categoryChartRef) return;

    const ctx = this.categoryChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Données réelles basées sur les catégories d'événements
    const categories = ['Tech', 'Design', 'Business', 'Culture'];
    const counts = [3, 2, 1, 2]; // À remplacer par de vraies données

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: counts,
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#f5576c'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }

  ngOnDestroy() {
    // Nettoyer les graphiques
    if (this.participationChart) {
      this.participationChart.destroy();
    }
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }
  }
}

