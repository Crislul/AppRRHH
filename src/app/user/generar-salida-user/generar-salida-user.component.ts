import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeguridadService } from '../../services/seguridad.service';
import { DateTime } from 'luxon';
import { SalidaService } from '../../services/salida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-salida-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './generar-salida-user.component.html',
  styleUrl: './generar-salida-user.component.css'
})
export class GenerarSalidaUserComponent implements OnInit{

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

  resetForm() {
    this.salida = {
      horaSalida: '',
      horaEntrada: '',
      horarioTrabajo: '',
      asunto: '',
      fecha: DateTime.now().setZone('America/Mexico_City').toFormat('dd/MM/yyyy'),
      usuarioId: '',
      usuarioNombre: '', 
      usuarioApellidoP: '', 
      usuarioApellidoM: '',
      areaId: '',
      areaNombre: '',  
      categoriaId: '',
      categoriaNombre: '',  
      estatus: 0
    };
  }

  areas: any[] = [];
  categorias: any[] = [];

  salida: any = {
  
      horaSalida: '',
      horaEntrada: '',
      horarioTrabajo: '',
    
      asunto: '',
      fecha: DateTime.now().setZone('America/Mexico_City').toFormat('dd/MM/yyyy'),
    
      usuarioId: '',
      usuarioNombre: '', 
      usuarioApellidoP: '', 
      usuarioApellidoM: '',
    
      areaId: '',
      areaNombre: '',  
    
      categoriaId: '',
      categoriaNombre: '',  
        
      estatus: 0
      };


      fechaHoy: string = new Date().toLocaleDateString('es-MX', {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split('/').reverse().join('-');


      constructor(
        private salidaService: SalidaService
      ){}

      ngOnInit() {
        this.salida.usuarioId = this.idUsuario();
        this.salida.usuarioNombre = this.nombreUsuario();
      
        this.salidaService.getAreas().subscribe(data => (this.areas = data));
        this.salidaService.getCategorias().subscribe(data => (this.categorias = data));
      }


      submitForm() {
        this.salidaService.createAutorizacion(this.salida).subscribe({
          next: response => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Autorizacion creada con éxito',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.resetForm();
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
