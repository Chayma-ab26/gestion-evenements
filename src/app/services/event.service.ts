import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = '/api/events'; // port backend réel

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
  return this.http.get<Event[]>(`${this.apiUrl}/getAllWithLocal`);
}


  getById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/getbyid/${id}`);
  }

  getEventWithCategoryAndLocal(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/getEventWithCategoryAndLocal/${id}`);
  }

  create(event: any): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/createWithCategoryAndLocal`, event);
  }

  update(id: string, event: any): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/updateWithCategoryAndLocal/${id}`, event);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  participate(eventId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/participate`, formData);
  }
  getParticipants(eventId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}/participants`);
  }

  approveParticipant(eventId: string, participantId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}/participants/${participantId}/approve`, {});
  }

  rejectParticipant(eventId: string, participantId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}/participants/${participantId}/reject`, {});
  }
}
