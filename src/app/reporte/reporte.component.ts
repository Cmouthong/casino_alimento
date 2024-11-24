import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para ngModel
import { DatePipe } from '@angular/common'; // Para pipes como date y currency
import { ReporteService } from './reporte.service';

@Component({
  selector: 'app-reporte',
  standalone: true,
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  imports: [CommonModule, FormsModule], // Importar los módulos necesarios
  providers: [DatePipe], // Proveer DatePipe si es usado programáticamente
})
export class ReporteComponent implements OnInit {
  empresas: any[] = []; // Lista de empresas
  reportes: any[] = []; // Lista de reportes obtenidos del backend
  reporte = {
    empresa: '',
    fechaInicio: '',
    fechaFin: '',
  };

  constructor() {}

  ngOnInit(): void {
    this.cargarEmpresas(); // Carga inicial de empresas
  }

  cargarEmpresas(): void {
    // Lista de empresas simuladas o reemplazadas por datos reales del servicio
    this.empresas = [
      { nit: '123', nombre: 'Empresa 1' },
      { nit: '456', nombre: 'Empresa 2' },
      { nit: '789', nombre: 'Empresa 3' },
    ];
  }

  generarReporte(): void {
    if (!this.reporte.empresa || !this.reporte.fechaInicio || !this.reporte.fechaFin) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Simulación de creación de un nuevo reporte
    const nuevoReporte = {
      id: this.reportes.length + 1,
      empresa: this.empresas.find((e) => e.nit === this.reporte.empresa),
      fechaInicio: this.reporte.fechaInicio,
      fechaFin: this.reporte.fechaFin,
      totalConsumos: Math.random() * 10000,
    };

    this.reportes.push(nuevoReporte);
    alert('Reporte generado exitosamente.');
    this.reporte = { empresa: '', fechaInicio: '', fechaFin: '' }; // Limpiar formulario
  }

  eliminarReporte(id: number): void {
    this.reportes = this.reportes.filter((reporte) => reporte.id !== id);
    alert('Reporte eliminado exitosamente.');
  }
}