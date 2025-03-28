import { Component, OnInit } from '@angular/core';
import { Area, AreaService, CreateAreaDto } from '../../services/area.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

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

  constructor(private areaService: AreaService) {}

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

  deleteArea(id: number) {
    if (confirm('¿Estás seguro de eliminar esta área?')) {
      this.areaService.deleteArea(id).subscribe(() => {
        this.loadAreas();
      });
    }
  }

  resetForm() {
    this.areaForm = { nombre: '' };
    this.isEditing = false;
    this.editingId = null;
  }

}
