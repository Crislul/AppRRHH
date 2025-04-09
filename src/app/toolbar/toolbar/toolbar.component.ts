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
    MatMenuModule
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
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  help(){
    this.router.navigate(['/Help']);
  }

  editUser(){
    this.router.navigate(['/configuracion']);
  }

  notifications = [
    { message: 'El docente Luis Enrique solicita permiso de salida' },
    { message: 'El docente Rocio Noruega solicita generar incidencia' },
    { message: 'El trabajador Mario Miguel solicita permiso de salida' }
  ];

}
