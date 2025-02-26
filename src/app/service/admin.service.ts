import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl = 'https://localhost:7000/api/Admin';
  //apiurl='https://business-11.onrender.com/api/Admin';

  constructor(private http: HttpClient) { }

  checkEmailExistsAdmin(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email?email=${email}`);
  } 
  addSubAdmin(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-sub-admin?email=${email}`,email);
   }
}
