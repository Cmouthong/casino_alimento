import { Component, OnInit } from '@angular/core';
import { PlatoService } from './plato.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plato.component.html',
  styleUrls: ['./plato.component.scss'],
})
export class PlatoComponent implements OnInit {
  platos: any[] = []; // Lista de platos registrados
  nuevoPlato: any = {
    nombre: '',
    precio: 0,
    descripcion: '',
    categoria: '',
  };

  constructor() {}

  ngOnInit(): void {
    // Simular carga inicial de platos
    this.platos = [
      {
        id: 1,
        nombre: 'Plato 1',
        precio: 10.99,
        descripcion: 'Descripción del plato 1',
        categoria: 'Entrante',
      },
      {
        id: 2,
        nombre: 'Plato 2',
        precio: 15.5,
        descripcion: 'Descripción del plato 2',
        categoria: 'Principal',
      },
    ];
  }

  registrarPlato(): void {
    const nuevoPlato = {
      ...this.nuevoPlato,
      id: this.platos.length + 1,
    };

    this.platos.push(nuevoPlato);
    alert('Plato registrado exitosamente.');
    this.nuevoPlato = { nombre: '', precio: 0, descripcion: '', categoria: '' }; // Limpiar formulario
  }

  eliminarPlato(id: number): void {
    this.platos = this.platos.filter((plato) => plato.id !== id);
    alert('Plato eliminado exitosamente.');
  }
}