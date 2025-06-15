import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/interfaces/user.interface';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { roles: [UserRole.ADMIN] },
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
          },
          {
            path: 'empresas',
            loadComponent: () => import('./features/admin/empresas/empresas.component').then(m => m.EmpresasComponent)
          },
          {
            path: 'consumidores',
            loadComponent: () => import('./features/admin/consumidores/consumidores.component').then(m => m.ConsumidoresComponent)
          },
          {
            path: 'platos',
            loadComponent: () => import('./features/admin/platos/platos.component').then(m => m.PlatosComponent)
          },
          {
            path: 'usuarios',
            loadComponent: () => import('./features/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent)
          }
        ]
      },
      {
        path: 'cajero',
        canActivate: [authGuard, roleGuard],
        data: { roles: [UserRole.CAJERO] },
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./features/cajero/cajero-dashboard/cajero-dashboard.component').then(m => m.CajeroDashboardComponent)
          },
          {
            path: 'consumos',
            loadComponent: () => import('./features/cajero/consumos/consumos.component').then(m => m.ConsumosComponent)
          }
        ]
      },
      {
        path: 'contador',
        canActivate: [authGuard, roleGuard],
        data: { roles: [UserRole.CONTADOR] },
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./features/contador/contador-dashboard/contador-dashboard.component').then(m => m.ContadorDashboardComponent)
          },
          {
            path: 'reportes',
            loadComponent: () => import('./features/contador/reportes/reportes.component').then(m => m.ReportesComponent)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
