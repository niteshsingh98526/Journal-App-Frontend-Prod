import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt');
  console.log('JWT Token in Interceptor:', token); // Debugging

  if (token && req.url.startsWith('https://journal-backend-prod-qbom.onrender.com')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  console.log('Modified Request:', req); // Debugging
  return next(req);
};
