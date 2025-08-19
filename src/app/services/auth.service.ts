import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'jwt';

  constructor(private router: Router) {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']); // Redirect to login on logout
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    return expiration ? Date.now() > expiration : true;
  }

  autoLogoutOnTokenExpiration() {
    const expiration = this.getTokenExpiration();
    if (!expiration) return;

    const timeout = expiration - Date.now();
    if (timeout > 0) {
      setTimeout(() => this.removeToken(), timeout);
    } else {
      this.removeToken();
    }
  }
}