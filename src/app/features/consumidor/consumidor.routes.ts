import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/interfaces/user.interface';

export const CONSUMIDOR_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./consumidor-dashboard/consumidor-dashboard.component')
          .then(m => m.ConsumidorDashboardComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.CONSUMIDOR] }
      },
      {
        path: 'consumos',
        loadComponent: () => import('./consumos/consumos.component')
          .then(m => m.ConsumosComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.CONSUMIDOR] }
      },
      {
        path: 'perfil',
        loadComponent: () => import('./perfil/perfil.component')
          .then(m => m.PerfilComponent),
        canActivate: [roleGuard],
        data: { roles: [UserRole.CONSUMIDOR] }
      }
    ]
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.component').then(m => m.HistorialComponent)
  }
]; 