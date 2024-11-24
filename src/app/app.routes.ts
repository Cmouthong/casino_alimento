import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { EmpleadoComponent } from './empleado/empleado.component';
import { ConsumoComponent } from './consumo/consumo.component';
import { ReporteComponent } from './reporte/reporte.component';
import { PlatoComponent } from './plato/plato.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Contenedor principal con el menú
  { path: 'empresa', component: EmpresaComponent },  // Ruta para Registrar Empresa
  { path: 'empleado', component: EmpleadoComponent },  // Ruta para Registrar Empleado
  { path: 'consumo', component: ConsumoComponent },  // Ruta para Registrar Consumo
  { path: 'plato', component: PlatoComponent }, //Ruta para registrar plato
  { path: 'reporte', component: ReporteComponent },  // Ruta para Generar Reporte
  { path: '**', redirectTo: '' }  // Redirección a la página principal
];
