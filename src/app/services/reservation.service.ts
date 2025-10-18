import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8070/reservations'; // Port backend

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  // Créer une réservation d'événement
  createEventReservation(eventId: number, nbParticipants: number = 1): Observable<any> {
    const token = this.keycloakService.getToken(); // Récupère le token JWT

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const reservation = {
      eventId: eventId,
      nbParticipants: nbParticipants,
      // userId sera rempli côté backend via le token
    };

    return this.http.post<any>(`${this.apiUrl}/create`, reservation, { headers });
  }

  // Obtenir toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/getall`);
  }

  // Obtenir une réservation par ID
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/getbyid/${id}`);
  }

  // Mettre à jour le statut d'une réservation
  updateStatus(id: number, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/updatestatus/${id}?status=${status}`, null);
  }

  // Supprimer une réservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
