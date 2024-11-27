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
  empresas: any[] = [];
  nuevaEmpresa: any = {
    nit: '',
    nombre: '',
    direccion: '',
    telefono: '',
    contacto: '',
  };
  editando = false;

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe(
      (data) => (this.empresas = data),
      (error) => console.error('Error al cargar empresas:', error)
    );
  }

  registrarEmpresa(): void {
    if (this.editando) {
      this.empresaService.actualizarEmpresa(this.nuevaEmpresa.nit, this.nuevaEmpresa).subscribe(
        (data) => {
          const index = this.empresas.findIndex((e) => e.nit === data.nit);
          if (index !== -1) {
            this.empresas[index] = data; // Actualiza la lista local
          }
          alert('Empresa actualizada exitosamente.');
          this.resetFormulario();
        },
        (error) => console.error('Error al actualizar la empresa:', error)
      );
    } else {
      this.empresaService.registrarEmpresa(this.nuevaEmpresa).subscribe(
        (data) => {
          this.empresas.push(data);
          alert('Empresa registrada exitosamente.');
          this.resetFormulario();
        },
        (error) => console.error('Error al registrar la empresa:', error)
      );
    }
  }

  cargarEmpresa(empresa: any): void {
    this.nuevaEmpresa = { ...empresa }; // Copia los datos de la empresa seleccionada
    this.editando = true;
  }

  eliminarEmpresa(nit: string): void {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      this.empresaService.eliminarEmpresa(nit).subscribe(
        () => {
          this.empresas = this.empresas.filter((emp) => emp.nit !== nit);
          alert('Empresa eliminada exitosamente.');
        },
        (error) => console.error('Error al eliminar la empresa:', error)
      );
    }
  }

  resetFormulario(): void {
    this.nuevaEmpresa = { nit: '', nombre: '', direccion: '', telefono: '', contacto: '' };
    this.editando = false;
  }
}
