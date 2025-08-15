// event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { CategoryService } from '../../services/category.service';
import { LocalService } from '../../services/local.service';
import { FooterComponent } from '../../footer/footer.component'; // Assurez-vous que ce composant est utilisé si nécessaire (sinon, retirez-le des imports)
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderOrgComponent } from '../../organisateur/header-org/header-org.component';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [HeaderOrgComponent, FooterComponent, CommonModule, HttpClientModule]
})
export class EventListComponent implements OnInit {
  listevents: any[] = [];
  filteredEvents: any[] = [];
  categories: any[] = [];
  locals: any[] = [];

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.categoryService.getAll() as Observable<any[]>,
      this.localService.getAll() as Observable<any[]>,
      this.eventService.getAll() as Observable<any[]>
    ]).subscribe(
      ([cats, locs, events]) => {
        this.categories = cats;
        this.locals = locs;
        this.listevents = events;
        this.enrichEventsIfNeeded(); // Enrichissement une fois toutes les données chargées
      },
      error => console.log('Erreur lors du chargement groupé', error)
    );
  }

  enrichEventsIfNeeded() {
    if (this.categories.length > 0 && this.locals.length > 0 && this.listevents.length > 0) {
      this.filteredEvents = this.listevents.map(event => {
        const category = this.categories.find(c => c.id === event.categoryId);
        const local = this.locals.find(l => l.id === event.localId);
        return { ...event, category, local };
      });
      console.log('Enriched events:', this.filteredEvents); // Log pour debug (retirez en production si nécessaire)
    }
  }

  participateEvent(eventId: string) {
    console.log('Participer à l\'événement ID:', eventId);
    // Appeler ton service EventService.participate si nécessaire
  }
}