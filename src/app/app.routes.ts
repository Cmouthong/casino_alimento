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
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'cajero',
        canActivate: [authGuard, roleGuard],
        data: { roles: [UserRole.CAJERO] },
        loadChildren: () => import('./features/cajero/cajero.routes').then(m => m.CAJERO_ROUTES)
      },
      {
        path: 'contador',
        canActivate: [authGuard, roleGuard],
        data: { roles: [UserRole.CONTADOR] },
        loadChildren: () => import('./features/contador/contador.routes').then(m => m.CONTADOR_ROUTES)
      },
      {
        path: 'consumidor',
        canActivate: [authGuard, roleGuard],
        data: { roles: [UserRole.CONSUMIDOR] },
        loadChildren: () => import('./features/consumidor/consumidor.routes').then(m => m.CONSUMIDOR_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
