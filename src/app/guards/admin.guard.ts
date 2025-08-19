import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  try {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const isAdmin = Array.isArray(roles) && roles.includes('ADMIN');
    if (token && isAdmin) {
      return true;
    }
  } catch {}
  router.navigate(['/login']);
  return false;
};