import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();
  // if (!token || authService.isTokenExpired()) {
  //   // clear old data
  //   authService.removeToken();

  //   router.navigate(['/login']);
  //   return false;
  // }

  try {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const isAdmin = Array.isArray(roles) && roles.includes('ADMIN');
    if (isAdmin) {
      return true;
    }
  } catch {}

  

  router.navigate(['/login']);
  return false;
};