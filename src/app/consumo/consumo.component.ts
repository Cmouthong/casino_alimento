import { Component, OnInit } from '@angular/core';
import { ConsumoService } from './consumo.service';
import { PlatoService } from '../plato/plato.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa los módulos necesarios
})
export class ConsumoComponent implements OnInit {
  consumos: any[] = []; // Lista de consumos
  consumo: any = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] }; // Inicialización de consumo
  nuevoConsumo: any = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] }; // Nuevo consumo
  platos: any[] = []; // Lista de platos disponibles
  platoSeleccionado: string = ''; // Plato seleccionado
  cantidad: number = 1; // Cantidad seleccionada
  editando: boolean = false; // Estado de edición

  constructor(
    private consumoService: ConsumoService,
    private platoService: PlatoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerConsumos();
    this.platoService.obtenerPlatos().subscribe((data) => {
      this.platos = data;
    });
  }

  obtenerConsumos(): void {
    this.consumoService.obtenerConsumos().subscribe((data) => {
      this.consumos = data;
    });
  }

  agregarPlato(): void {
    if (this.platoSeleccionado && this.cantidad > 0) {
      const plato = { nombrePlato: this.platoSeleccionado, cantidad: this.cantidad };
      this.consumo.platosConsumidos.push(plato);
      this.platoSeleccionado = '';
      this.cantidad = 1;
    }
  }

  guardarConsumo(): void {
    if (this.editando) {
      this.consumoService
        .actualizarConsumo(this.consumo.id, this.consumo)
        .subscribe(() => {
          this.obtenerConsumos();
          this.editando = false;
        });
    } else {
      this.consumoService.anadirConsumo(this.consumo).subscribe(() => {
        this.obtenerConsumos();
      });
    }
    this.consumo = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] };
  }

  anadirConsumo() {
    this.http.post('/api/consumos', this.nuevoConsumo).subscribe((data: any) => {
      this.consumos.push(data);
      this.nuevoConsumo = { cedulaEmpleado: '', fecha: '', platosConsumidos: [] };
    });
  }

  editarConsumo(consumo: any): void {
    this.consumo = { ...consumo };
    this.editando = true;
  }

  eliminarConsumo(id: number): void {
    this.consumoService.eliminarConsumo(id).subscribe(() => {
      this.obtenerConsumos();
    });
  }
}
