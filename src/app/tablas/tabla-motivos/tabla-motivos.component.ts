import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Motivo, CreateMotivoDto, MotivoService } from '../../services/motivo.service';
import Swal from 'sweetalert2';

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

 deleteMotivo(motivo: Motivo): void {
     Swal.fire({
       title: '¿Estás seguro?',
       text: '⚠️ Esta acción eliminará el motivo de forma permanente.',
       icon: 'warning',
       showCancelButton: true,
       confirmButtonColor: '#d33',
       cancelButtonColor: '#3085d6',
       confirmButtonText: 'Eliminar',
       cancelButtonText: 'Cancelar'
     }).then((result) => {
       if (result.isConfirmed) {
         this.motivoService.deleteMotivo(motivo.id).subscribe({
           next: () => {
            this.loadMotivos();
             Swal.fire({
               title: '¡Eliminada!',
               text: 'El motivo ha sido eliminado correctamente.',
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
    this.motivoForm = { nombre: '' };
    this.isEditing = false;
    this.editingId = null;
  }

}
