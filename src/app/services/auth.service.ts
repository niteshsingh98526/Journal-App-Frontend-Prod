import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private tokenKey = 'token';

  constructor(private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.autoLogoutOnTokenExpiration(); // Schedule auto logout immediately
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('roles');
		localStorage.removeItem('currentUser');
    this.router.navigate(['/login']); // Redirect to login on logout
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      return payload.exp ? payload.exp * 1000 : null; // Convert to ms
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    return expiration ? Date.now() > expiration : true;
  }

  autoLogoutOnTokenExpiration() {
    const expiration = this.getTokenExpiration();
    if (!expiration){
      this.removeToken();
      return;
    }

    const timeout = expiration - Date.now();
    if (timeout > 0) {
      setTimeout(() => this.removeToken(), timeout);
    } else {
      this.removeToken();
    }
  }
}