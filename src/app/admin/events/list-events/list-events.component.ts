import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { FooterComponent } from '../../../footer/footer.component';
import { EventService } from '../../../services/event.service';
import { CategoryService } from '../../../services/category.service';
import { LocalService } from '../../../services/local.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-events',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './list-events.component.html',
  styleUrl: './list-events.component.css'
})
export class ListEventsComponent implements OnInit {

  listevents: any[] = [];
  filteredEvents: any[] = [];
  selectedStatus: string = 'all';
  statuses: string[] = ['all', 'ACTIVE', 'INACTIVE', 'PENDING', 'COMPLETED'];
  categories: any[] = [];
  locals: any[] = [];

  constructor(
    private eventService: EventService, 
    private categoryService: CategoryService,
    private localService: LocalService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.loadCategoriesAndLocals();
    this.allmyeventsfromback()
  }

  loadCategoriesAndLocals() {
    // Charger les catégories
    this.categoryService.getAll().subscribe(
      (categories: any) => {
        this.categories = categories;
        this.enrichEventsIfNeeded();
      },
      (error: any) => console.log("Erreur chargement catégories", error)
    );

    // Charger les locaux
    this.localService.getAll().subscribe(
      (locals: any) => {
        this.locals = locals;
        this.enrichEventsIfNeeded();
      },
      (error: any) => console.log("Erreur chargement locaux", error)
    );
  }

  enrichEventsIfNeeded() {
    // Enrichir les événements seulement si on a les catégories et locaux
    if (this.categories.length > 0 && this.locals.length > 0 && this.listevents.length > 0) {
      this.listevents = this.enrichEventsWithDetails(this.listevents);
      this.filterEvents();
    }
  }

  enrichEventsWithDetails(events: any[]) {
    return events.map(event => {
      const category = this.categories.find(cat => cat.id == event.categoryId);
      const local = this.locals.find(loc => loc.id == event.localId);
      
      return {
        ...event,
        category: category || null,
        local: local || null
      };
    });
  }
  
  allmyeventsfromback() {
    this.eventService.getAll().subscribe(
      (res: any) => {
        console.log("**liste de events avec category et local**")
        this.listevents = res;
        this.filterEvents();
      }, (error: any) => { 
        console.log("error", error);
        // Fallback to basic getAll and enrich with details
        this.eventService.getAll().subscribe(
          (basicRes: any) => {
            console.log("**liste de events basique**")
            this.listevents = this.enrichEventsWithDetails(basicRes);
            this.filterEvents();
          }, (basicError: any) => { console.log("error basique", basicError) }
        );
      }
    )
  }

  filterEvents() {
    if (this.selectedStatus === 'all') {
      this.filteredEvents = this.listevents;
    } else {
      this.filteredEvents = this.listevents.filter(event => event.status === this.selectedStatus);
    }
  }

  onStatusChange() {
    this.filterEvents();
  }
  
  viewEvent(id: String) {
    Swal.fire({
      title: 'Do you want to view details?',
      text: "This will fetch the details for this event.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085D6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, show me!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.getEventWithCategoryAndLocal(id).subscribe(
          (res: any) => {
            console.log('Fetched event data:', res);
            Swal.fire({
              title: 'Event Details',
              html: `
                <div style="text-align: left;">
                  <strong>ID:</strong> ${res.id}<br>
                  <strong>Title:</strong> ${res.title}<br>
                  <strong>Description:</strong> ${res.description}<br>
                  <strong>Start Date:</strong> ${res.datedebut}<br>
                  <strong>End Date:</strong> ${res.datefin}<br>
                  <strong>Status:</strong> <span class="badge badge-${this.getStatusBadgeClass(res.status)}">${res.status}</span><br>
                  <strong>Category:</strong> ${res.category?.name || 'N/A'}<br>
                  <strong>Local:</strong> ${res.local?.name || 'N/A'}<br>
                  <strong>Organizer ID:</strong> ${res.userId || 'N/A'}
                </div>
              `,
              icon: 'info'
            });
          },
          (error: any) => {
            console.error("Error fetching data", error);
            Swal.fire('Error', 'Could not fetch event data.', 'error');
          }
        );
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'secondary';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'info';
      default: return 'secondary';
    }
  }

  getStatusDisplayName(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'PENDING': return 'Pending';
      case 'COMPLETED': return 'Completed';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
