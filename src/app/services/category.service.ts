import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  getAll(){
   {return this.http.get(`${this.apiUrl}/getall`)}
  }

  getById(id: String){
    return this.http.get(`${this.apiUrl}/getbyid/${id}`);
  }

  create(category: any): any {
   
    return this.http.post(`${this.apiUrl}/create`, category);
  }

  // ✅ Update category
  update(id: String, category: any) {
    return this.http.put(`${this.apiUrl}/update/${id}`, category);
  }

  // ✅ Delete category
  delete(id: String){
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
