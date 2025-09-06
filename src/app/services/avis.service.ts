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

  // Créer un nouvel avis
  createAvis(userId: number, eventId: number, note: number, commentaire?: string): Observable<Avis> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('eventId', eventId.toString());
    formData.append('note', note.toString());
    if (commentaire) {
      formData.append('commentaire', commentaire);
    }
    return this.http.post<Avis>(`${this.apiUrl}/create`, formData);
  }

  // Récupérer tous les avis
  getAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/getall`);
  }

  // Récupérer les avis pour un événement spécifique
  getAvisByEvent(eventId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/event/${eventId}`);
  }

  // Récupérer les avis d'un utilisateur
  getAvisByUser(userId: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/user/${userId}`);
  }
}
