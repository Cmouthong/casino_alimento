import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/user.interface';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();
  const requiredRoles = route.data['roles'] as UserRole[];

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (requiredRoles.includes(user.rol)) {
    return true;
  }

  // Redirigir al dashboard correspondiente según el rol
  switch (user.rol) {
    case UserRole.ADMIN:
      router.navigate(['/admin/dashboard']);
      break;
    case UserRole.CAJERO:
      router.navigate(['/cajero/dashboard']);
      break;
    case UserRole.CONTADOR:
      router.navigate(['/contador/dashboard']);
      break;
    default:
      router.navigate(['/login']);
  }

  return false;
}; 