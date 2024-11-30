import { Component, OnInit } from '@angular/core';
import { PlatoService } from './plato.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plato',
  templateUrl: './plato.component.html',
  styleUrls: ['./plato.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa los módulos necesarios
})
export class PlatoComponent implements OnInit {
  platos: any[] = [];
  plato: any = { nombre: '', precio: 0, descripcion: '',  categoria: '' };
  editando: boolean = false;

  constructor(private platoService: PlatoService) {}

  ngOnInit(): void {
    this.obtenerPlatos();
  }

  obtenerPlatos(): void {
    this.platoService.obtenerPlatos().subscribe((data) => {
      this.platos = data;
    });
  }

  guardarPlato(): void {
    if (this.editando) {
      this.platoService
        .actualizarPlato(this.plato.id, this.plato)
        .subscribe(() => {
          this.obtenerPlatos();
          this.editando = false;
        });
    } else {
      this.platoService.anadirPlato(this.plato).subscribe(() => {
        this.obtenerPlatos();
      });
    }
    this.plato = { nombre: '', precio: 0, descripcion: '', categoria: '' };
  }

  editarPlato(plato: any): void {
    this.plato = { ...plato };
    this.editando = true;
  }

  eliminarPlato(id: number): void {
    this.platoService.eliminarPlato(id).subscribe(() => {
      this.obtenerPlatos();
    });
  }
}
