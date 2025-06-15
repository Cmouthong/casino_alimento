import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const CAJERO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cajero-dashboard/cajero-dashboard.component').then(m => m.CajeroDashboardComponent)
  },
  {
    path: 'consumos',
    loadComponent: () => import('./consumos/consumos.component').then(m => m.ConsumosComponent)
  }
]; 