import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar para usar ngModel
import { ReporteService } from './reporte.service';
import { EmpresaService } from '../empresa/empresa.service'; // Servicio para obtener empresas

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar módulos necesarios para el componente standalone
})
export class ReporteComponent implements OnInit {
  empresas: any[] = [];
  reportes: any[] = [];
  nuevoReporte = {
    nitEmpresa: '',
    fechaInicio: '',
    fechaFin: '',
  };

  constructor(
    private reporteService: ReporteService,
    private empresaService: EmpresaService
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
    this.cargarReportes();
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe(
      (data) => {
        this.empresas = data;
      },
      (error) => console.error('Error al cargar las empresas:', error)
    );
  }

  cargarReportes(): void {
    this.reporteService.obtenerReportes().subscribe(
      (data) => {
        this.reportes = data;
      },
      (error) => console.error('Error al cargar los reportes:', error)
    );
  }

  generarReporte(): void {
    if (!this.nuevoReporte.nitEmpresa || !this.nuevoReporte.fechaInicio || !this.nuevoReporte.fechaFin) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.reporteService.crearReporte(this.nuevoReporte).subscribe(
      (reporte) => {
        this.reportes.push(reporte);
        alert('Reporte generado exitosamente.');
        this.resetFormulario();
      },
      (error) => console.error('Error al generar el reporte:', error)
    );
  }

  eliminarReporte(id: number): void {
    if (confirm('¿Estás seguro de eliminar este reporte?')) {
      this.reporteService.eliminarReporte(id).subscribe(
        () => {
          this.reportes = this.reportes.filter((reporte) => reporte.id !== id);
          alert('Reporte eliminado exitosamente.');
        },
        (error) => console.error('Error al eliminar el reporte:', error)
      );
    }
  }

  resetFormulario(): void {
    this.nuevoReporte = {
      nitEmpresa: '',
      fechaInicio: '',
      fechaFin: '',
    };
  }
}