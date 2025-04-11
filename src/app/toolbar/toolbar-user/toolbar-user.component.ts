import {Component, inject, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {Router, RouterModule } from '@angular/router';
import {CommonModule } from '@angular/common';
import {MatMenuModule } from '@angular/material/menu';
import { SeguridadService } from '../../services/seguridad.service';
import { NotificacionesService, Notificacion } from '../../services/notificaciones.service';
import { interval, Subscription } from 'rxjs';
import { Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './toolbar-user.component.html',
  styleUrl: './toolbar-user.component.css'
})
export class ToolbarUserComponent implements OnInit {

  seguridadService = inject(SeguridadService);
  notificaciones: Notificacion[] = [];
  private pollingSub!: Subscription;
  mostrarMenu: boolean = false;
  @Input() rol: string = '';

  constructor(
    private router: Router,
    private notificacionesService: NotificacionesService
  ) {}

  rolUsuario: string = '';

  ngOnInit(): void {
    this.cargarNotificaciones();
  }
  
  ngOnDestroy(): void {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
    }
  }

  nombreUsuario(): string {
    return this.seguridadService.obtenerNombre();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  help() {
    this.router.navigate(['/Help']);
  }

  editUser() {
    this.router.navigate(['/configuracion']);
  }


  cargarNotificaciones() {
    this.notificacionesService.getNotificaciones().subscribe(
      (data) => {
        this.notificaciones = data;
      },
      (error) => {
        console.error('Error al obtener notificaciones', error);
      }
    );
  }
  
  irAVistaIncidencias() {
    this.router.navigate(['/tablaIncidenciasAdmin']);
  }
}
