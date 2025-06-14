import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'empresas',
    loadComponent: () => import('./empresas/empresas.component').then(m => m.EmpresasComponent)
  },
  {
    path: 'platos',
    loadComponent: () => import('./platos/platos.component').then(m => m.PlatosComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent),
    canActivate: [/* Guard de admin si existe, si no, se puede agregar después */]
  }
]; 