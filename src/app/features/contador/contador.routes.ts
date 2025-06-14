import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const CONTADOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./contador-dashboard/contador-dashboard.component').then(m => m.ContadorDashboardComponent)
  },
  {
    path: 'reportes',
    loadComponent: () => import('./reportes/reportes.component').then(m => m.ReportesComponent)
  }
]; 