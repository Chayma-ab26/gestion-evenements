import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  // ✅ Get all users
  getAll() {
    return this.http.get(`${this.apiUrl}/getall`);
  }

  // ✅ Get user by ID
  getById(id: String) {
    return this.http.get(`${this.apiUrl}/getbyid/${id}`);
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
