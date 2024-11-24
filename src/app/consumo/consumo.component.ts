import { Component, OnInit } from '@angular/core';
import { ConsumoService } from './consumo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consumo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.scss'],
})
export class ConsumoComponent implements OnInit {
  consumos: any[] = [];
  platos: { id: number; nombre: string; precio: number }[] = [];
  nuevoConsumo: {
    cedulaEmpleado: string;
    fecha: string;
    total: number;
    platosConsumidos: { id: number; nombre: string; precio: number }[];
  } = {
    cedulaEmpleado: '',
    fecha: '',
    total: 0,
    platosConsumidos: [],
  };
  platoSeleccionado: number | null = null;

  constructor(private consumoService: ConsumoService) {}

  ngOnInit(): void {
    this.platos = [
      { id: 1, nombre: 'Plato 1', precio: 10000 },
      { id: 2, nombre: 'Plato 2', precio: 15000 },
    ];
    this.cargarConsumos();
  }

  cargarConsumos(): void {
    this.consumoService.obtenerConsumos().subscribe((data) => {
      this.consumos = data;
    });
  }

  agregarPlato(): void {
    const plato = this.platos.find((p) => p.id === this.platoSeleccionado);
    if (plato) {
      this.nuevoConsumo.platosConsumidos.push(plato);
      this.nuevoConsumo.total += plato.precio;
    }
  }

  eliminarPlato(id: number): void {
    const index = this.nuevoConsumo.platosConsumidos.findIndex((p: { id: number }) => p.id === id);
    if (index > -1) {
      this.nuevoConsumo.total -= this.nuevoConsumo.platosConsumidos[index].precio;
      this.nuevoConsumo.platosConsumidos.splice(index, 1);
    }
  }

  registrarConsumo(): void {
    this.consumoService.registrarConsumo(this.nuevoConsumo).subscribe((nuevoConsumo) => {
      this.consumos.push(nuevoConsumo);
      alert('Consumo registrado exitosamente.');
      this.nuevoConsumo = { cedulaEmpleado: '', fecha: '', total: 0, platosConsumidos: [] };
    });
  }

  eliminarConsumo(id: number): void {
    this.consumoService.eliminarConsumo(id).subscribe(() => {
      this.consumos = this.consumos.filter((consumo) => consumo.id !== id);
      alert('Consumo eliminado exitosamente.');
    });
  }
}