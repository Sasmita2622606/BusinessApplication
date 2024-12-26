import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = 'https://localhost:7000/api/Business';

  constructor(private http: HttpClient) {}

  registerBusiness(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  searchBusinesses(category: string, subcategory: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?category=${category}&subcategory=${subcategory}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetCategories`);
  }

  getImage(imagename: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getSubCategories(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetSubCategories/${categoryId}`);
  }
}
