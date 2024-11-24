import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from './empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa los módulos necesarios
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss'],
})
export class EmpleadoComponent implements OnInit {
  empleados: any[] = [];
  nuevoEmpleado: any = {
    cedula: '',
    nombre: '',
    empresaNIT: '',
    telefono: '',
  };

  constructor() {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    // Simula una lista inicial de empleados
    this.empleados = [
      { cedula: '123456789', nombre: 'Juan Pérez', empresaNIT: '987654321', telefono: '3001234567' },
    ];
  }

  registrarEmpleado(): void {
    this.empleados.push({ ...this.nuevoEmpleado });
    alert('Empleado registrado exitosamente.');
    this.nuevoEmpleado = { cedula: '', nombre: '', empresaNIT: '', telefono: '' };
  }

  eliminarEmpleado(cedula: string): void {
    this.empleados = this.empleados.filter((empleado) => empleado.cedula !== cedula);
    alert('Empleado eliminado exitosamente.');
  }
}
