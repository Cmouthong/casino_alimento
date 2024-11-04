import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { ConsumoComponent } from './consumo/consumo.component';
import { MenuComponent } from './menu/menu.component';
import { ReporteComponent } from './reporte/reporte.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Ruta para la vista principal (Inicio)
  { path: 'empresa', component: EmpresaComponent },  // Ruta para Registrar Empresa
  { path: 'empleado', component: EmpleadoComponent },  // Ruta para Registrar Empleado
  { path: 'consumo', component: ConsumoComponent },  // Ruta para Registrar Consumo
  { path: 'menu', component: MenuComponent },  // Ruta para Modificar Menú
  { path: 'reporte', component: ReporteComponent },  // Ruta para Generar Reporte
  { path: '**', redirectTo: '' }  // Ruta de fallback
];