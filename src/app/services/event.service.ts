import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = '/api/events';
  updateWithCategoryAndLocal: any;

  constructor(private http: HttpClient) {}

  // ✅ Get all events
  getAll() {
    return this.http.get(`${this.apiUrl}/getall`);
  }

   //✅ Get all events with category and local
  // getAllWithCategoryAndLocal(id: string, value: any) {
  //  return this.http.get(`${this.apiUrl}/getallWithCategoryAndLocal`);
  //}

  // ✅ Get event by ID
  getById(id: String) {
    return this.http.get(`${this.apiUrl}/getbyid/${id}`);
  }

  // ✅ Get event with category and local
  getEventWithCategoryAndLocal(id: String) {
    return this.http.get(`${this.apiUrl}/getEventWithCategoryAndLocal/${id}`);
  }

  // ✅ Create new event
  create(event: any): any {
    return this.http.post(`${this.apiUrl}/createWithCategoryAndLocal`,event);
  }

  // ✅ Update event
  update(id: String, event: any) {
    return this.http.put(`${this.apiUrl}/updateWithCategoryAndLocal/${id}`, event);
  }

  // ✅ Delete event
  delete(id: String) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
   participate(eventId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/participate`, formData);
  }
}


