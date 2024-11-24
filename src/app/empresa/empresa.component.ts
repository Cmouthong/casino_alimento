import { Component, OnInit } from '@angular/core';
import { EmpresaService } from './empresa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
})
export class EmpresaComponent implements OnInit {
  empresas: any[] = []; // Lista de empresas
  nuevaEmpresa: any = {
    nit: '',
    nombre: '',
    direccion: '',
    telefono: '',
    contacto: '',
  };

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  // Cargar la lista de empresas
  cargarEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe(
      (data) => {
        this.empresas = data;
      },
      (error) => {
        console.error('Error al cargar las empresas:', error);
      }
    );
  }

  // Registrar una nueva empresa
  registrarEmpresa(): void {
    this.empresaService.registrarEmpresa(this.nuevaEmpresa).subscribe(
      (data) => {
        this.empresas.push(data); // Agregar la nueva empresa a la lista
        alert('Empresa registrada exitosamente.');
        this.nuevaEmpresa = {
          nit: '',
          nombre: '',
          direccion: '',
          telefono: '',
          contacto: '',
        }; // Reiniciar el formulario
      },
      (error) => {
        console.error('Error al registrar la empresa:', error);
      }
    );
  }

  // Eliminar una empresa por su NIT
  eliminarEmpresa(nit: string): void {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      this.empresaService.eliminarEmpresa(nit).subscribe(
        () => {
          this.empresas = this.empresas.filter((empresa) => empresa.nit !== nit);
          alert('Empresa eliminada exitosamente.');
        },
        (error) => {
          console.error('Error al eliminar la empresa:', error);
        }
      );
    }
  }
}