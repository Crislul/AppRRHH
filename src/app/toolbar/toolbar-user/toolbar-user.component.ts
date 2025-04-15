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
  usuarioid:number | null  = null; //id del usuario pa las notis

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
    
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    console.log('ID del usuario desde localStorage:', usuarioId);
      if (usuarioId) {
    this.cargarNotificaciones(); // Carga inicial

  

    // Hot reload: actualiza cada 5 segundos
    this.pollingSub = interval(10000).subscribe(() => {
      this.cargarNotificaciones();
    });
  }
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
  const usuarioId = Number(localStorage.getItem('usuarioId'));
  if (usuarioId) {
    this.notificacionesService.getNotificacionesPorUsuario(usuarioId).subscribe({
      next: (notis) => {
        console.log('Notificaciones obtenidas del backend:', notis); // 👀
        this.notificaciones = notis.filter(n => n.tipo === 'respuesta' && n.estado === 'pendiente');
      },
      error: (err) => {
        console.error('Error al obtener notificaciones:', err);
      }
    });
    
  }
}

  
irAVista(noti: Notificacion) {
  const tipo = noti.tipoPermiso?.toLowerCase(); // 'incidencia' o 'salida'
  const id = noti.permisoId;

  if (tipo && id) {
    // Redirige según el tipo
    if (tipo === 'incidencia') {
      this.router.navigate(['/incidenciaUser', id]);
    } else if (tipo === 'salida') {
      this.router.navigate(['/salidaUser', id]);
    }

    //Luego elimina la notificación
   this.notificacionesService.eliminarnotificacion(noti.id).subscribe();
  } else {
    console.warn('Notificación sin tipoPermiso o permisoId');
  }
}

}
