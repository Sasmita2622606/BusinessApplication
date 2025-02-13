import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Check if the user is logged in
  }

  logout() {
    localStorage.removeItem('token');
  }
}
