import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl = 'https://localhost:7000/api/Admin';
  //apiurl='https://business-11.onrender.com/api/Admin/';

  constructor(private http: HttpClient) { }
 
  addSubAdmin(email: string): Observable<any> {   
    debugger
    return this.http.post<any>(`${this.apiUrl}/add_sub-admin?email=${email}`,email);
   }
}
