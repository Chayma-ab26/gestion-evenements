import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalService } from '../../services/local.service';
import { Local } from '../../models/local.model';
import { formatDate, registerLocaleData } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HeaderOrgComponent } from '../header-org/header-org.component';
import { FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';

@Component({
  selector: 'app-reservation-local',
  templateUrl: './reservation-local.component.html',
  styleUrls: ['./reservation-local.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HeaderOrgComponent,
    FormsModule
  ],
  providers: [
  { provide: LOCALE_ID, useValue: 'fr-FR' }
]
})
export class ReservationLocalComponent implements OnInit {
  locals: Local[] = [];
  filteredLocals: Local[] = [];
  selectedLocal: Local | null = null;
  reservationForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  currentDisplayedImage: string | null = null;

  constructor(
    private localService: LocalService,
    private fb: FormBuilder
  ) {
        registerLocaleData(localeFr, 'fr-FR');

    this.reservationForm = this.fb.group({
      date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadLocals();
  }

  loadLocals(): void {
    this.localService.getAll().subscribe({
      next: (data: any) => {
        this.locals = data.map((local: any) => this.adaptLocal(local));
        this.filteredLocals = [...this.locals];
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des locaux';
        console.error(err);
      }
    });
  }

  filterLocals(): void {
    if (!this.searchTerm) {
      this.filteredLocals = [...this.locals];
      return;
    }
    this.filteredLocals = this.locals.filter(local =>
      local.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      local.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      local.adress.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  private adaptLocal(backendLocal: any): Local {
    return {
      ...backendLocal,
      images: backendLocal.image
    };
  }

  selectLocal(local: Local): void {
    this.selectedLocal = local;
    const images = this.getLocalImages(local);
    this.currentDisplayedImage = images.length > 0 ? `http://localhost:8766/locals/files/${images[0]}` : null;
    this.reservationForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  changeDisplayedImage(index: number): void {
    const images = this.getLocalImages(this.selectedLocal!);
    if (images.length > index) {
      this.currentDisplayedImage = `http://localhost:8766/locals/files/${images[index]}`;
    }
  }

  openLightbox(imageUrl: string | null): void {
    if (!imageUrl) return;
    console.log('Ouvrir lightbox avec:', imageUrl);
  }

  reserverLocal(): void {
  if (!this.selectedLocal || !this.reservationForm.valid) {
    this.errorMessage = 'Veuillez sélectionner un local et une date valide';
    return;
  }

  const selectedDate = this.reservationForm.get('date')?.value;
  const dateObj = new Date(selectedDate);
  const formattedDate = formatDate(dateObj, 'yyyy-MM-dd', 'fr-FR');

  const reservedId = this.selectedLocal.id; 

  this.localService.reserverLocal(reservedId, formattedDate)
    .subscribe({
      next: (response: string) => {
        this.successMessage = response || 'Réservation effectuée avec succès';
        
        this.loadLocals();

        setTimeout(() => {
          this.selectedLocal = this.locals.find(l => l.id === reservedId) || null;
        }, 300);

        this.reservationForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Erreur lors de la réservation';
        console.error(err);
      }
    });
}


  getLocalImages(local: Local): string[] {
    try {
      const jsonString = local.images || (local as any).image;
      return jsonString ? JSON.parse(jsonString) : [];
    } catch {
      return [];
    }
  }

  getFirstImageUrl(local: Local): string | null {
    const images = this.getLocalImages(local);
    return images.length > 0 ? `http://localhost:8766/locals/files/${images[0]}` : null;
  }

  todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}