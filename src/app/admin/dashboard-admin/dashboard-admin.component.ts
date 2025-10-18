import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../header/header.component';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { ReservationService } from '../../services/reservation.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

// Interface for Event - CORRIGÉE
interface Event {
  id: string | number;
  name: string;
  datedebut: string;
  participants: number;
  maxParticipants: number;
  status: string;
  // Propriétés optionnelles qui pourraient exister
  title?: string;
  organizer?: string;
  dateDebut?: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('eventChart') chartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  statusChart: Chart | undefined;

  // Statistiques principales
  totalEvents = 0;
  totalParticipants = 0;
  upcomingEvents = 0;
  recentEvents: Event[] = [];

  // Nouvelles statistiques
  totalUsers = 0;
  totalLocals = 0;
  totalCategories = 0;
  totalReservations = 0;

  // Données pour graphiques
  usersByRole: any = {};
  eventsByStatus: any = {};
  recentUsers: any[] = [];

  // Chargement
  isLoading: boolean = true;

  private events: Event[] = [];
  private users: any[] = [];
  private locals: any[] = [];
  private categories: any[] = [];
  private reservations: any[] = [];

  constructor(
    private router: Router, 
    private eventService: EventService, 
    private userService: UserService,
    private localService: LocalService,
    private categoryService: CategoryService,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    const today = new Date();
    this.loadDashboardData(today);
  }

  loadDashboardData(today: Date) {
    this.isLoading = true;
    
    // Charger toutes les données en parallèle
    Promise.all([
      this.loadEvents(today),
      this.loadUsers(),
      this.loadLocals(),
      this.loadCategories(),
      this.loadReservations()
    ]).finally(() => {
      this.isLoading = false;
      setTimeout(() => this.createCharts(), 100);
    });
  }

  loadEvents(today: Date): Promise<void> {
    return new Promise((resolve) => {
      this.eventService.getAll().subscribe({
        next: (events: any) => {
          this.events = events;
          this.totalEvents = this.events.length;
          this.totalParticipants = this.events.reduce((sum, e) => sum + (e.participants || 0), 0);
          this.recentEvents = this.events.slice(-5).reverse();
          this.calculateEventsByStatus(events);
          resolve();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des événements:', err);
          resolve();
        }
      });
    });
  }

  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.userService.getAll().subscribe({
        next: (users: any) => {
          this.users = users;
          this.totalUsers = this.users.length;
          this.recentUsers = this.users.slice(-5).reverse();
          this.calculateUsersByRole(users);
          resolve();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des utilisateurs:', err);
          resolve();
        }
      });
    });
  }

  loadLocals(): Promise<void> {
    return new Promise((resolve) => {
      this.localService.getAll().subscribe({
        next: (locals: any) => {
          this.locals = locals;
          this.totalLocals = this.locals.length;
          resolve();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des locaux:', err);
          resolve();
        }
      });
    });
  }

  loadCategories(): Promise<void> {
    return new Promise((resolve) => {
      this.categoryService.getAll().subscribe({
        next: (categories: any) => {
          this.categories = categories;
          this.totalCategories = this.categories.length;
          resolve();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des catégories:', err);
          resolve();
        }
      });
    });
  }

  loadReservations(): Promise<void> {
    return new Promise((resolve) => {
      this.reservationService.getAllReservations().subscribe({
        next: (reservations: any) => {
          this.reservations = reservations;
          this.totalReservations = this.reservations.length;
          resolve();
        },
        error: (err: any) => {
          console.error('Erreur lors du chargement des réservations:', err);
          resolve();
        }
      });
    });
  }

  calculateUsersByRole(users: any[]): void {
    this.usersByRole = {
      admin: users.filter(user => user.role === 'ADMIN' || user.role === 'admin').length,
      organizer: users.filter(user => user.role === 'ORGANIZER' || user.role === 'organizer').length,
      participant: users.filter(user => user.role === 'PARTICIPANT' || user.role === 'participant').length
    };
  }

  calculateEventsByStatus(events: any[]): void {
    this.eventsByStatus = {
      active: events.filter(event => event.status === 'ACTIVE' || event.status === 'active').length,
      pending: events.filter(event => event.status === 'PENDING' || event.status === 'pending').length,
      completed: events.filter(event => event.status === 'COMPLETED' || event.status === 'completed').length,
      cancelled: events.filter(event => event.status === 'CANCELLED' || event.status === 'cancelled').length
    };
  }

  ngAfterViewInit() {
    // Les graphiques seront créés après le chargement des données
  }

  createCharts() {
    this.createUsersChart();
    this.createEventsChart();
  }

  createUsersChart() {
    if (this.chartRef && this.usersByRole) {
      const ctx = this.chartRef.nativeElement.getContext('2d');
      if (ctx) {
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Administrateurs', 'Organisateurs', 'Participants'],
            datasets: [{
              data: [this.usersByRole.admin, this.usersByRole.organizer, this.usersByRole.participant],
              backgroundColor: ['#4361ee', '#f72585', '#4cc9f0'],
              borderWidth: 2,
              borderColor: '#fff'
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              title: {
                display: true,
                text: 'Répartition des utilisateurs'
              }
            }
          }
        });
      }
    }
  }

  createEventsChart() {
    if (this.statusChartRef && this.eventsByStatus) {
      const ctx = this.statusChartRef.nativeElement.getContext('2d');
      if (ctx) {
        if (this.statusChart) {
          this.statusChart.destroy();
        }
        this.statusChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Actifs', 'En attente', 'Terminés', 'Annulés'],
            datasets: [{
              label: 'Événements par statut',
              data: [this.eventsByStatus.active, this.eventsByStatus.pending, this.eventsByStatus.completed, this.eventsByStatus.cancelled],
              backgroundColor: ['#27ae60', '#f39c12', '#3498db', '#e74c3c'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Événements par statut'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }
  }

  // Méthodes utilitaires pour obtenir les propriétés d'événement
  getEventName(event: Event): string {
    return event.name || event.title || 'Titre non défini';
  }

  getEventDate(event: Event): string {
    return event.datedebut || event.dateDebut || '';
  }

  getEventOrganizer(event: Event): string {
    return event.organizer || 'Organisateur inconnu';
  }

  getFillRate(): number {
    if (this.events.length === 0) return 0;
    const totalParticipants = this.events.reduce((sum, e) => sum + (e.participants || 0), 0);
    const totalCapacity = this.events.reduce((sum, e) => sum + (e.maxParticipants || 1), 0);
    return Math.round((totalParticipants / totalCapacity) * 100);
  }

  getActiveEvents(): number {
    return this.eventsByStatus.active || 0;
  }

  getCompletedEvents(): number {
    return this.eventsByStatus.completed || 0;
  }

  getPendingEvents(): number {
    return this.eventsByStatus.pending || 0;
  }

  // Navigation et actions
  createEvent() {
    this.router.navigate(['/create-event']);
  }

  goToEventManagement() {
    this.router.navigate(['/event-management']);
  }

  goToParticipants() {
    Swal.fire('Info', 'Page de gestion des participants à implémenter', 'info');
  }

  goToReservations() {
    Swal.fire('Info', 'Page de gestion des locaux à implémenter', 'info');
  }

  goToAnalytics() {
    Swal.fire('Info', 'Page des analyses à implémenter', 'info');
  }

  // Nouvelles méthodes de navigation
  navigateToUsers(): void {
    Swal.fire('Info', 'Navigation vers la gestion des utilisateurs', 'info');
  }

  navigateToEvents(): void {
    this.goToEventManagement();
  }

  navigateToCategories(): void {
    Swal.fire('Info', 'Navigation vers la gestion des catégories', 'info');
  }

  navigateToLocals(): void {
    Swal.fire('Info', 'Navigation vers la gestion des locaux', 'info');
  }

  // Actions rapides
  addUser(): void {
    Swal.fire('Info', 'Ajouter un nouvel utilisateur', 'info');
  }

  manageCategories(): void {
    this.navigateToCategories();
  }

  manageLocals(): void {
    this.navigateToLocals();
  }

  exportData(): void {
    const data = {
      statistics: {
        totalUsers: this.totalUsers,
        totalEvents: this.totalEvents,
        totalLocals: this.totalLocals,
        totalCategories: this.totalCategories,
        totalReservations: this.totalReservations,
        totalParticipants: this.totalParticipants
      },
      usersByRole: this.usersByRole,
      eventsByStatus: this.eventsByStatus,
      recentUsers: this.recentUsers,
      recentEvents: this.recentEvents,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    Swal.fire('Succès', 'Données exportées avec succès!', 'success');
  }

  // Méthodes utilitaires
  getRoleBadgeClass(role: string): string {
    switch(role?.toUpperCase()) {
      case 'ADMIN': return 'role-admin';
      case 'ORGANIZER': return 'role-organizer';
      case 'PARTICIPANT': return 'role-participant';
      default: return 'role-default';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status?.toUpperCase()) {
      case 'ACTIVE': return 'status-active';
      case 'PENDING': return 'status-pending';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  viewEvent(event: Event) {
    Swal.fire({
      title: this.getEventName(event),
      html: `
        <div style="text-align: left;">
          <p><strong>Date:</strong> ${this.formatDate(this.getEventDate(event))}</p>
          <p><strong>Participants:</strong> ${event.participants} / ${event.maxParticipants}</p>
          <p><strong>Status:</strong> ${event.status}</p>
          <p><strong>Organisateur:</strong> ${this.getEventOrganizer(event)}</p>
        </div>
      `,
      confirmButtonText: 'Fermer'
    });
  }

  editEvent(event: Event) {
    Swal.fire('Info', `Édition de l'événement ${this.getEventName(event)} à implémenter`, 'info');
  }

  viewUser(user: any) {
    Swal.fire({
      title: `${user.firstName} ${user.lastName}`,
      html: `
        <div style="text-align: left;">
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Rôle:</strong> ${user.role}</p>
          <p><strong>Date d'inscription:</strong> ${this.formatDate(user.createdAt)}</p>
        </div>
      `,
      confirmButtonText: 'Fermer'
    });
  }

  editUser(user: any) {
    Swal.fire('Info', `Édition de l'utilisateur ${user.firstName} ${user.lastName} à implémenter`, 'info');
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.statusChart) {
      this.statusChart.destroy();
    }
  }
}