import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderOrgComponent } from "../header-org/header-org.component";
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { ReservationService } from '../../services/reservation.service';

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
  imports: [CommonModule, HeaderOrgComponent],
  templateUrl: './dashboard-org.component.html',
  styleUrl: './dashboard-org.component.css'
})
export class DashboardOrgComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('eventChart') chartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  statusChart: Chart | undefined;

  totalEvents = 0;
  totalParticipants = 0;
  upcomingEvents = 0;
  recentEvents: Event[] = [];

  private events: Event[] = [];

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit() {
    const today = new Date('2025-08-25'); // Using the current date as per query
    this.loadEvents(today);
  }

  loadEvents(today: Date) {
    this.eventService.getAll().subscribe({
      next: (events: any) => {
        this.events = events;
        this.totalEvents = this.events.length;
        this.totalParticipants = this.events.reduce((sum, e) => sum + e.participants, 0);
        this.upcomingEvents = this.events.filter(e => new Date(e.datedebut) > today).length;
        this.recentEvents = this.events.slice(0, 3);
        this.renderChart(this.events);
        this.renderStatusChart(this.events);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des événements:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.renderChart(this.events);
    this.renderStatusChart(this.events);
  }

  renderChart(events: Event[]) {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: events.map(e => e.name),
        datasets: [{
          label: 'Participants',
          data: events.map(e => e.participants),
          backgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  renderStatusChart(events: Event[]) {
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const today = new Date('2025-08-25');
    const upcoming = events.filter(e => new Date(e.datedebut) > today).length;
    const past = events.length - upcoming;

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['À venir', 'Passés'],
        datasets: [{
          data: [upcoming, past],
          backgroundColor: ['#2ecc71', '#e74c3c']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  getFillRate(): number {
    if (this.events.length === 0) return 0;
    const totalParticipants = this.events.reduce((sum, e) => sum + e.participants, 0);
    const totalCapacity = this.events.reduce((sum, e) => sum + e.maxParticipants, 0);
    return Math.round((totalParticipants / totalCapacity) * 100);
  }

  getActiveEvents(): number {
    return this.events.filter(e => e.status === 'active').length;
  }

  getCompletedEvents(): number {
    return this.events.filter(e => e.status === 'completed').length;
  }

  getPendingEvents(): number {
    return this.events.filter(e => e.status === 'pending').length;
  }

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

  viewEvent(event: Event) {
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

  editEvent(event: Event) {
    Swal.fire('Info', `Édition de l'événement ${event.name} à implémenter`, 'info');
  }

  exportData() {
    Swal.fire('Info', 'Fonctionnalité d\'export des données à implémenter', 'info');
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
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.statusChart) {
      this.statusChart.destroy();
    }
  }
}
