import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token && !authService.isTokenExpired()) {
    return true; // ✅ User is authenticated, allow access
  }

  authService.removeToken();
  router.navigate(['/login']);
  return false;
};
