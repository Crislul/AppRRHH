import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IncidenciaService } from '../../services/incidencia.service';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-incidencia-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './generar-incidencia-admin.component.html',
  styleUrl: './generar-incidencia-admin.component.css'
})



export class GenerarIncidenciaAdminComponent implements OnInit{

  usuarios: any[] = [];
  areas: any[] = [];
  categorias: any[] = [];
  motivos: any[] = [];

  incidencia: any = {
    descripcion: '',
    fecha: DateTime.now().setZone('America/Mexico_City').toFormat('dd/MM/yyyy'),
    fechaInicio: '',
    fechaFin: '',
    usuarioId: '',
    usuarioNombre: '',
    areaId: '',
    areaNombre: '',
    categoriaId: '',
    categoriaNombre:'',
    motivoId: '',
    motivoNombre: '',
    estatus: 0,
  };


  fechaHoy: string = new Date().toISOString().split('T')[0];



constructor(private incidenciaService: IncidenciaService) {}

ngOnInit() {
  this.incidenciaService.ObtenerUsuarios().subscribe(data => (this.usuarios = data));
  this.incidenciaService.getAreas().subscribe(data => (this.areas = data));
  this.incidenciaService.getCategorias().subscribe(data => (this.categorias = data));
  this.incidenciaService.getMotivos().subscribe(data => (this.motivos = data));
}



submitForm() {
  this.incidenciaService.createIncidencia(this.incidencia).subscribe({
    next: response => {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Incidencia creada con éxito',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
    error: error => {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al crear la incidencia',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  });
}

}
