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
    estatusDir: 0,
    estatusAdmin: 0,
    archivo: null
  };


  fechaHoy: string = new Date().toLocaleDateString('es-MX', {
  timeZone: 'America/Mexico_City',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
  });

  



constructor(private incidenciaService: IncidenciaService) {}

ngOnInit() {
  this.incidenciaService.ObtenerUsuarios().subscribe(data => (this.usuarios = data));
  this.incidenciaService.getAreas().subscribe(data => (this.areas = data));
  this.incidenciaService.getCategorias().subscribe(data => (this.categorias = data));
  this.incidenciaService.getMotivos().subscribe(data => (this.motivos = data));
}

subirReceta(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.incidencia.archivo = file;
  }
}


habilitarArchivo: boolean = false;

onMotivoChange() {
  const motivoSeleccionado = this.motivos.find(m => m.id == this.incidencia.motivoId);
  const motivosConArchivo = ['Incapacidad', 'Consulta médica', 'Cuidados maternos'];

  if (motivoSeleccionado) {
    this.habilitarArchivo = motivosConArchivo.includes(motivoSeleccionado.nombre);
  } else {
    this.habilitarArchivo = false;
  }

}

quitarArchivo() {
  this.incidencia.archivo = null;
}


resetForm() {
  this.incidencia = {
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
    estatusDir: 0,
    estatusAdmin: 0,
    archivo: null
  };
  this.habilitarArchivo = false;
}

submitForm() {
  this.incidenciaService.createIncidencia(this.incidencia).subscribe({
    next: (response) => {
      const incidenciaId = response.id;

      if (this.incidencia.archivo) {
        this.incidenciaService.uploadFile(incidenciaId, this.incidencia.archivo).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Incidencia creada y archivo subido con éxito',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.resetForm();
            });
          },
          error: (error) => {
            console.error('Error al subir archivo:', error);
            Swal.fire({
              title: 'Incidencia creada',
              text: 'Pero hubo un problema al subir el archivo',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Incidencia creada con éxito',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.resetForm();
        });
      }
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
