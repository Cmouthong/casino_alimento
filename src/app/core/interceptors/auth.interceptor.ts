import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  
  // No agregar el token para las rutas de autenticación
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Limpiar el almacenamiento local
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            // Redirigir al login
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
  }
  return next(req);
}; 