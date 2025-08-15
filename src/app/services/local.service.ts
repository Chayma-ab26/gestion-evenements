// src/app/services/local.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Local } from '../models/local.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private apiUrl = '/api/locals';

  constructor(private http: HttpClient) {}

  // ✅ Get all locals
  getAll() {
    return this.http.get(`${this.apiUrl}/getall`);
  }

  // ✅ Get local by ID
  getById(id: String) {
    return this.http.get(`${this.apiUrl}/getbyid/${id}`);
  }

  // ✅ Create new local
  create(local: any): any {
    return this.http.post(`${this.apiUrl}/create`, local);
  }

  // ✅ Update local
  update(id: String, local: any) {
    return this.http.put(`${this.apiUrl}/update/${id}`, local);
  }

  // ✅ Delete local
  delete(id: String) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
reserverLocal(id: number, date: string) {
    return this.http.post(`${this.apiUrl}/${id}/reserver`, null, {
      params: { date },
      responseType: 'text' 
    });
  }
}