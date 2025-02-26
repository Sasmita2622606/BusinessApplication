import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private apiUrl = 'https://localhost:44387/api/Business';
  private cus_ApiUrl = 'https://localhost:44387/api/Customer';
  private businessRating_ApiUrl = 'https://localhost:44387/api/BusinessRatings';
  
  // private apiUrl = 'https://business-11.onrender.com/api/Business';
  // private cus_ApiUrl = 'https://business-11.onrender.com/api/Customer';

  constructor(private http: HttpClient) {}

  registerBusiness(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  updateBusiness(formData: FormData): Observable<any> {
    return this.http.put(`${this.businessRating_ApiUrl}`, formData);
  }

  addBusinessRating(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.cus_ApiUrl}/check-email?email=${email}`);
  }
  checkEmailExistsBusiness(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  }

  getCustomerDetailsByID(cusId: number): Observable<any> {
    return this.http.get<any>(`${this.cus_ApiUrl}/getcusdetailsbyid?cusId=${cusId}`);
  }  

  registerCustomer(inputdata:any)
  {
    return this.http.post(this.cus_ApiUrl, inputdata);
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
  getBusinessDetailById(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getbusinessdetailbyid/${id}`);
  }
  
  getDistance(originLatitude:any, originLongitude:any, destLatitude:any, destLongitude:any): Observable<any[]>{
    
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?units=metric&origins=${originLatitude},${originLongitude}&destinations=${destLatitude},${destLongitude}&key=${environment.API_KEY}`;
    return this.http.get<any>(url);
  }
}
