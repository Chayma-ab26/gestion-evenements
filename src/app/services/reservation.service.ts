// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8070/reservations'; // Update if needed

  constructor(private http: HttpClient) {}

  // Create reservation
  createReservation(reservation: Reservation): Observable<Reservation> {
    const formData = new FormData();
    formData.append('reservationDate', reservation.reservationDate);
    formData.append('userId', reservation.userId.toString());
    formData.append('eventId', reservation.eventId.toString());

    return this.http.post<Reservation>(`${this.apiUrl}/createWithEventAndUser`, formData);
  }

  // Update reservation
  updateReservation(id: number, reservation: Reservation): Observable<Reservation> {
    const formData = new FormData();
    formData.append('reservationDate', reservation.reservationDate);
    formData.append('userId', reservation.userId.toString());
    formData.append('eventId', reservation.eventId.toString());

    if (reservation.status) {
      formData.append('status', reservation.status);
    }

    return this.http.put<Reservation>(`${this.apiUrl}/update/${id}`, formData);
  }

  // Get one reservation by ID
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/getbyid/${id}`);
  }

  // Get all reservations
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/getall`);
  }

  // Update only status
  updateStatus(id: number, status: string): Observable<Reservation> {
    const params = new HttpParams().set('status', status);
    return this.http.put<Reservation>(`${this.apiUrl}/updatestatus/${id}`, null, { params });
  }

  // Delete reservation
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
