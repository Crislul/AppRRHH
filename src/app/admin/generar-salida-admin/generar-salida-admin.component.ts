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
  
    lugar: '',
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

    fechaHoy: string = new Date().toISOString().split('T')[0];


    constructor (private salidaService: SalidaService){}


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
