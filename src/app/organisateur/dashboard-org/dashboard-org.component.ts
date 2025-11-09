import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';
import { LocalService } from '../../services/local.service';
import { CategoryService } from '../../services/category.service';
import { AvisService } from '../../services/avis.service';
import { HeaderOrgComponent } from "../header-org/header-org.component";
import { CommonModule } from '@angular/common';

// Interface for Event
interface Event {
  id: string | number;
  name: string;
  datedebut: string;
  participants: number;
  maxParticipants: number;
  status: string;
}

@Component({
  selector: 'app-dashboard-org',
  standalone: true,
  templateUrl: './dashboard-org.component.html',
  styleUrls: ['./dashboard-org.component.css'],
  imports: [HeaderOrgComponent,CommonModule]
})
export class DashboardOrgComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('eventChart') eventChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  eventChart: Chart | undefined;
  statusChart: Chart | undefined;

  totalEvents = 0;
  totalParticipants = 0;
  upcomingEvents = 0;
  recentEvents: Event[] = [];

  private events: Event[] = [];

  constructor(
    private router: Router,
    private eventService: EventService,
    private userService: UserService,
    private reservationService: ReservationService,
    private localService: LocalService,
    private categoryService: CategoryService,
    private avisService: AvisService,
    private ngZone :NgZone
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        this.events = events;
        this.calculateStats();
        this.renderCharts();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des événements:', err);
        // Fallback to sample data if API fails
        this.loadSampleData();
      }
    });
  }

  loadSampleData() {
    // Sample data for demonstration
    this.events = [
      { id: 1, name: 'Conférence Tech 2023', datedebut: '2023-08-25', participants: 120, maxParticipants: 150, status: 'completed' },
      { id: 2, name: 'Atelier Design UX', datedebut: '2023-09-18', participants: 45, maxParticipants: 50, status: 'active' },
      { id: 3, name: 'Séminaire Leadership', datedebut: '2023-10-05', participants: 85, maxParticipants: 100, status: 'active' },
      { id: 4, name: 'Webinaire Marketing Digital', datedebut: '2023-10-15', participants: 60, maxParticipants: 200, status: 'upcoming' },
      { id: 5, name: 'Forum des Métiers', datedebut: '2023-11-10', participants: 38, maxParticipants: 80, status: 'upcoming' }
    ];
    this.calculateStats();
  }

  calculateStats() {
    const today = new Date();
    this.totalEvents = this.events.length;
    this.totalParticipants = this.events.reduce((sum, e) => sum + e.participants, 0);
    this.upcomingEvents = this.events.filter(e => new Date(e.datedebut) > today).length;
    this.recentEvents = this.events.slice(0, 3);
  }

  ngAfterViewInit() {
    this.renderCharts();
  }

  renderCharts() {
    this.renderEventChart();
    this.renderStatusChart();
  }

  renderEventChart() {
    const ctx = this.eventChartRef?.nativeElement.getContext('2d');
    if (!ctx || this.events.length === 0) return;

    if (this.eventChart) {
      this.eventChart.destroy();
    }

    this.eventChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.events.map(e => e.name),
        datasets: [{
          label: 'Participants',
          data: this.events.map(e => e.participants),
          backgroundColor: '#4361ee',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  renderStatusChart() {
    const ctx = this.statusChartRef?.nativeElement.getContext('2d');
    if (!ctx || this.events.length === 0) return;

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const today = new Date();
    const upcoming = this.events.filter(e => new Date(e.datedebut) > today).length;
    const active = this.events.filter(e => new Date(e.datedebut) <= today && e.status === 'active').length;
    const completed = this.events.filter(e => e.status === 'completed').length;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['À venir', 'En cours', 'Terminés'],
        datasets: [{
          data: [upcoming, active, completed],
          backgroundColor: ['#4361ee', '#4cc9f0', '#f72585'],
          borderWidth: 0,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        cutout: '65%'
      }
    });
  }

  getFillRate(): number {
    if (this.events.length === 0) return 0;
    const totalParticipants = this.events.reduce((sum, e) => sum + e.participants, 0);
    const totalCapacity = this.events.reduce((sum, e) => sum + e.maxParticipants, 0);
    return Math.round((totalParticipants / totalCapacity) * 100);
  }

  createEvent() {
    this.router.navigate(['/create-event']);
  }

  goToEventManagement() {
    this.router.navigate(['/event-management']);
  }

  goToParticipants() {
    this.router.navigate(['/participants-management']);
  }

  goToReservations() {
    this.router.navigate(['/reservations']);
  }

  
  viewEvent(event: Event, e?: MouseEvent) {
    if (e) {
      e.stopPropagation();
    }

    Swal.fire({
      title: event.name,
      html: `
        <div style="text-align: left;">
          <p><strong>Date:</strong> ${this.formatDate(event.datedebut)}</p>
          <p><strong>Participants:</strong> ${event.participants} / ${event.maxParticipants}</p>
          <p><strong>Status:</strong> ${event.status}</p>
        </div>
      `,
      confirmButtonText: 'Fermer'
    });
  }

  editEvent(event: Event, e: MouseEvent) {
    e.stopPropagation();
    this.router.navigate(['/edit-event', event.id]);
  }

   goToProfile() {
    // Navigation vers le profil
    this.ngZone.run(() => {
      this.router.navigate(['/profile']);
    });
  }
  exportData() {
    // Generate CSV data
    const headers = ['Nom', 'Date', 'Participants', 'Capacité maximale', 'Status'];
    const csvData = this.events.map(event => [
      event.name,
      this.formatDate(event.datedebut),
      event.participants,
      event.maxParticipants,
      event.status
    ]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    csvData.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'evenements.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Succès', 'Les données ont été exportées avec succès', 'success');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  ngOnDestroy() {
    if (this.eventChart) {
      this.eventChart.destroy();
    }
    if (this.statusChart) {
      this.statusChart.destroy();
    }
  }
}
