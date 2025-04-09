import { Component, OnInit } from '@angular/core';
import { Area, AreaService, CreateAreaDto } from '../../services/area.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-areas',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule],
  templateUrl: './tabla-areas.component.html',
  styleUrl: './tabla-areas.component.css'
})
export class TablaAreasComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  areas: Area[] = [];
  areaForm: CreateAreaDto = { nombre: '' };
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private areaService: AreaService) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas() {
    this.areaService.getAreas().subscribe((data) => {
      this.areas = data;
    });
  }

  createArea() {
    if (this.areaForm.nombre.trim() === '') return;

    if (this.isEditing && this.editingId !== null) {
      this.areaService.updateArea(this.editingId, this.areaForm).subscribe(() => {
        this.resetForm();
        this.loadAreas();
      });
    } else {
      this.areaService.createArea(this.areaForm).subscribe(() => {
        this.resetForm();
        this.loadAreas();
      });
    }
  }

  editArea(area: Area) {
    this.areaForm = { nombre: area.nombre };
    this.isEditing = true;
    this.editingId = area.id;
  }

  deleteArea(area: Area): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '⚠️ Esta acción eliminará el area de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.areaService.deleteArea(area.id).subscribe({
          next: () => {
            this.loadAreas();
            Swal.fire({
              title: '¡Eliminada!',
              text: 'El área ha sido eliminada correctamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: `Hubo un problema al eliminar el área. Intenta nuevamente más tarde. ${err.message}`,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
  

  resetForm() {
    this.areaForm = { nombre: '' };
    this.isEditing = false;
    this.editingId = null;
  }

}
