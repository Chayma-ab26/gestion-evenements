
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8070/reservations';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService
  ) {}

  // Méthode privée pour obtenir les headers avec token
  private getHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Créer une réservation d'événement
  createEventReservation(eventId: number, nbParticipants: number = 1): Observable<any> {
    const reservation = {
      eventId: eventId,
      nbParticipants: nbParticipants,
    };

    return this.http.post<any>(`${this.apiUrl}/create`, reservation, { headers: this.getHeaders() });
  }

  // Obtenir toutes les réservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/getall`, { headers: this.getHeaders() });
  }

  // Obtenir une réservation par ID
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/getbyid/${id}`, { headers: this.getHeaders() });
  }

  // Mettre à jour le statut d'une réservation
  updateStatus(id: number, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/updatestatus/${id}?status=${status}`, null, { headers: this.getHeaders() });
  }

  // Supprimer une réservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir les réservations par utilisateur
  getReservationsByUser(userId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  getMyReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/my-reservations`, { headers: this.getHeaders() });
  }

 
  getWithUsers(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}/with-users`, { headers: this.getHeaders() });
  }

  // Approuver une réservation - CORRIGÉ pour utiliser number
  approve(reservationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservationId}/approve`, {}, { headers: this.getHeaders() });
  }

  // Rejeter une réservation - CORRIGÉ pour utiliser number
  reject(reservationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservationId}/reject`, {}, { headers: this.getHeaders() });
  }
   // Obtenir les réservations par événement - CORRIGÉ
   getByEvent(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getall`, { headers: this.getHeaders() }).pipe(
      map((reservations: any[]) => {
        // Filtrer les réservations par eventId
        const filteredReservations = reservations.filter(reservation => {
          // Vérifier sous différentes formes
          return reservation.eventId == eventId || 
                 reservation.event?.id == eventId ||
                 (reservation.event && reservation.event.id == eventId);
        });
        
        console.log(`Réservations pour event ${eventId}:`, filteredReservations);
        return filteredReservations;
      }),
      catchError((error) => {
        console.error('Erreur getByEvent:', error);
        // En cas d'erreur, retourner un tableau vide
        return of([]);
      })
    );
  }
  

}