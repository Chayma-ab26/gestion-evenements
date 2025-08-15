import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeaderOrgComponent } from "../header-org/header-org.component";
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dachboard-org',
  standalone: true,
  imports: [CommonModule,HeaderOrgComponent],
  templateUrl: './dachboard-org.component.html',
  styleUrl: './dachboard-org.component.css'
})
export class DachboardOrgComponent implements AfterViewInit {
  @ViewChild('eventChart') chartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;

  chart: Chart | undefined;
  statusChart: Chart | undefined;

  totalEvents = 0;
  totalParticipants = 0;
  upcomingEvents = 0;
  recentEvents: { name: string; date: string; participants: number }[] = [];

  private events = [
    { name: 'Conférence Dev', date: '2025-07-01', participants: 120 },
    { name: 'Hackathon IA', date: '2025-08-10', participants: 80 },
    { name: 'Meetup Angular', date: '2025-06-20', participants: 60 },
    { name: 'Forum Sécurité', date: '2025-08-15', participants: 100 }
  ];

  ngOnInit() {
    const today = new Date();
    this.totalEvents = this.events.length;
    this.totalParticipants = this.events.reduce((sum, e) => sum + e.participants, 0);
    this.upcomingEvents = this.events.filter(e => new Date(e.date) > today).length;
    this.recentEvents = this.events.slice(0, 3);
  }

  ngAfterViewInit() {
    this.renderChart(this.events);
    this.renderStatusChart(this.events);
  }

  renderChart(events: any[]) {
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

  renderStatusChart(events: any[]) {
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const today = new Date();
    const upcoming = events.filter(e => new Date(e.date) > today).length;
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
}
