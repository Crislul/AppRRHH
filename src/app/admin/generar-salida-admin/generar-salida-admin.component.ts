import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { SalidaService } from '../../services/salida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generar-salida-admin',
  imports: [FormsModule, CommonModule],
  templateUrl: './generar-salida-admin.component.html',
  styleUrl: './generar-salida-admin.component.css'
})
export class GenerarSalidaAdminComponent implements OnInit{

  usuarios: any[] = [];
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
      
    estatusDir: 0,
    estatusAdmin: 0
    };

    fechaHoy: string = new Date().toLocaleDateString('es-MX', {
  timeZone: 'America/Mexico_City',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});



    constructor (private salidaService: SalidaService){}
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
        estatusDir: 0,
        estatusAdmin: 0
      };
    }
    

    ngOnInit() {
      this.salidaService.ObtenerUsuarios().subscribe(data => (this.usuarios = data));
      this.salidaService.getAreas().subscribe(data => (this.areas = data));
      this.salidaService.getCategorias().subscribe(data => (this.categorias = data));
    }

    submitForm() {
      this.salidaService.createAutorizacion(this.salida).subscribe({
        next: response => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Autorización de salida creada con éxito',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.resetForm();
          });
        },
        error: error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al crear la Autorización de salida',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }

}
