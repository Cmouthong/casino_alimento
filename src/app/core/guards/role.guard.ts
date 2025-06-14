import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/user.interface';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];
  const user = authService.getCurrentUser();

  console.log('roleGuard - user:', user);
  console.log('roleGuard - requiredRoles:', requiredRoles);

  if (!user || !requiredRoles.includes(user.rol)) {
    // Redirigir al dashboard correspondiente al rol del usuario
    switch (user?.rol) {
      case UserRole.ADMIN:
        router.navigate(['/admin/dashboard']);
        break;
      case UserRole.CAJERO:
        router.navigate(['/cajero/dashboard']);
        break;
      case UserRole.CONTADOR:
        router.navigate(['/contador/dashboard']);
        break;
      case UserRole.CONSUMIDOR:
        router.navigate(['/consumidor/dashboard']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  }

  return true;
}; 