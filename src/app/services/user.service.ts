import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 private apiUrl = '/api/users';

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  private getHeaders(): HttpHeaders {
    const token = this.keycloakService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Get all users
  getAll() {
    return this.http.get(`${this.apiUrl}/getall`);
  }

  // ✅ Get user by ID
  getById(id: String) {
    return this.http.get(`${this.apiUrl}/getbyid/${id}`, { headers: this.getHeaders() });
  }

  // ✅ Get current logged-in user
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getHeaders() });
  }


 /* create(user: any): any {
    return this.http.post(`${this.apiUrl}/create`, user);
  } */

 create(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, formData);
  }

  // ✅ Update user
  update(id: String, user: any) {
    return this.http.put(`${this.apiUrl}/update/${id}`, user);
  }

  // ✅ Delete user
  delete(id: String) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }



}
