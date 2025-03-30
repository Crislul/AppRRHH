import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import { IncidenciaService } from '../../services/incidencia.service';
import { SeguridadService } from '../../services/seguridad.service';

@Component({
  selector: 'app-generar-incidencia-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './generar-incidencia-user.component.html',
  styleUrl: './generar-incidencia-user.component.css'
})
export class GenerarIncidenciaUserComponent implements OnInit{

  seguridadService = inject(SeguridadService);

  idUsuario(): number{
    return this.seguridadService.obtenerId();
  }

  nombreUsuario(): string{
    return this.seguridadService.obtenerNombre();
  }

  apellidoPUsuario(): string{
    return this.seguridadService.obtenerApellidoP();
  }

  apellidoMUsuario(): string{
    return this.seguridadService.obtenerApellidoM();
  }
  
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
  this.incidencia.usuarioId = this.idUsuario();
  this.incidencia.usuarioNombre = this.nombreUsuario();

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
