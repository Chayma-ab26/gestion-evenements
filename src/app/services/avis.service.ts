import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Avis {
  id?: number;
  userId: number;
  eventId: number;
  note: number;
  commentaire?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = '/api/avis';

  constructor(private http: HttpClient) {}

  // Créer un avis (plus besoin de passer userId)
  createAvis(eventId: number, note: number, commentaire?: string): Observable<Avis> {
    const payload = { eventId, note, commentaire };
    return this.http.post<Avis>(`${this.apiUrl}/create`, payload);
  }

  getAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/getall`);
  }

  getAvisByEvent(eventId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/event/${eventId}`);
  }
}


