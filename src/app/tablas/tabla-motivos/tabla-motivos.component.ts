import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Motivo, CreateMotivoDto, MotivoService } from '../../services/motivo.service';

@Component({
  selector: 'app-tabla-motivos',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './tabla-motivos.component.html',
  styleUrl: './tabla-motivos.component.css'
})
export class TablaMotivosComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  motivos: Motivo[] = [];
  motivoForm: CreateMotivoDto = { nombre: '' };
  isEditing = false;
  editingId: number | null = null;

  constructor(private motivoService: MotivoService) {}

  ngOnInit(): void {
    this.loadMotivos();
  }

  loadMotivos() {
    this.motivoService.getMotivos().subscribe((data) => {
      this.motivos = data;
    });
  }

  createMotivo() {
    if (this.motivoForm.nombre.trim() === '') return;

    if (this.isEditing && this.editingId !== null) {
      this.motivoService.updateMotivo(this.editingId, this.motivoForm).subscribe(() => {
        this.resetForm();
        this.loadMotivos();
      });
    } else {
      this.motivoService.createMotivo(this.motivoForm).subscribe(() => {
        this.resetForm();
        this.loadMotivos();
      });
    }
  }

  editMotivo(motivo: Motivo) {
    this.motivoForm = { nombre: motivo.nombre };
    this.isEditing = true;
    this.editingId = motivo.id;
  }

  deleteMotivo(id: number) {
    if (confirm('¿Estás seguro de eliminar este motivo?')) {
      this.motivoService.deleteMotivo(id).subscribe(() => {
        this.loadMotivos();
      });
    }
  }

  resetForm() {
    this.motivoForm = { nombre: '' };
    this.isEditing = false;
    this.editingId = null;
  }

}
