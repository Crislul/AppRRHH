import {Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router, RouterModule } from '@angular/router';
import {CommonModule } from '@angular/common';
import {MatMenuModule } from '@angular/material/menu';
import { SeguridadService } from '../../services/seguridad.service';

@Component({
  selector: 'app-toolbar',
  imports: [
    RouterModule, 
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule,
    ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {

  seguridadService = inject(SeguridadService);

  nombreUsuario(): string{
    return this.seguridadService.obtenerNombre();
  }

  constructor(private router: Router) {}


  logout() {
    //console.log('Cerrando sesión...');
    // Lógica para cerrar sesión (borrar token, redirigir, etc.)
    // localStorage.removeItem('token');
    localStorage.removeItem('autenticado');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('idUsuario');
    this.router.navigate(['/login']);
  }

  help(){
    //console.log('Redireccionando...');

    this.router.navigate(['/Help']);
  }

  notifications = [
    { message: 'El docente Luis Enrique solicita permiso de salida' },
    { message: 'El docente Rocio Noruega solicita generar incidencia' },
    { message: 'El trabajador Mario Miguel solicita permiso de salida' }
  ];

}
