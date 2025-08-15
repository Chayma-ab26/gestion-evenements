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

  // ✅ Get all categories
  getAll(){
   {return this.http.get(`${this.apiUrl}/getall`)}
  }

  // ✅ Get category by ID
  getById(id: String){
    return this.http.get(`${this.apiUrl}/getbyid/${id}`);
  }

  // ✅ Create new category
  create(category: any): any {
    // const formData = new FormData();
    // formData.append('name', category.name);
    // formData.append('description', category.description);
    return this.http.post(`${this.apiUrl}/create`, category);
  }

  // ✅ Update category
  update(id: String, category: any) {
    // const formData = new FormData();
    // if (category.name) formData.append('name', category.name);
    // if (category.description) formData.append('description', category.description);
    return this.http.put(`${this.apiUrl}/update/${id}`, category);
  }

  // ✅ Delete category
  delete(id: String){
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
