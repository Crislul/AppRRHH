import { Component, inject, Input, OnInit } from '@angular/core';
import { SeguridadService } from '../../services/seguridad.service';
import { Notificacion, NotificacionesService } from '../../services/notificaciones.service';
import { interval, Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-toolbar-director',
standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './toolbar-director.component.html',
  styleUrl: './toolbar-director.component.css'
})
export class ToolbarDirectorComponent implements OnInit {

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
  this.rolUsuario = localStorage.getItem('rol') || '';

  if ( this.rolUsuario === '3') {
    this.cargarNotificaciones(); // carga inicial

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
  const rol = Number(this.rolUsuario);

  this.notificacionesService.getNotificacionesPorRol(rol).subscribe({
    next: (solicitudes) => {
      this.notificaciones = solicitudes.filter(n => n.estado === 'pendiente');
    },
    error: (err) => {
      console.error('Error al obtener notificaciones por rol:', err);
    }
  });
}


  
  
irAVista(noti: Notificacion) {
  const tipo = noti.tipoPermiso?.toLowerCase();
  const id = noti.permisoId;

  if (tipo && id) {
    let ruta = '';

    if (tipo === 'incidencia') {
      ruta = '/incidenciaDir';
    } else if (tipo === 'salida') {
      ruta = '/salidaDir';
    } else {
      console.warn('Tipo no reconocido:', tipo);
      return;
    }

    console.log(`➡️ Redirigiendo a ${ruta}/${id} con notiId ${noti.id}`);

    this.router.navigate([ruta, id], {
      state: { notificacionId: noti.id }
    });
  } else {
    console.warn('❌ Notificación inválida:', noti);
  }
}

  
  
  
}
