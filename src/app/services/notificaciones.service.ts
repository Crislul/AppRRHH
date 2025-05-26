import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notificacion {

  id: number;
  mensaje: string;
  tipo: string; // incidencia, salida ,respuesta
  estado: string; // pendiente, leido
  fecha: Date;
  permisoId?: number; //id de la incidencia o salida
  usuarioId?: number; // id del usuario 
  tipoPermiso?: string; // incidencia o salida para redireccion de respuesta

}


@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = 'https://apirrhh.onrender.com/api/notificaciones';

  constructor(private http: HttpClient) {}

  //get notificaciones generales
 getNotificacionesGenerales(): Observable<Notificacion[]> {
  return this.http.get<Notificacion[]>(`${this.apiUrl}/generales`);
}
//  put leida
  marcarNotificacionComoLeida(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/leida`, {});
  }

  eliminarnotificacion(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
//notis de respuesta para usuario (1)
  getNotificacionesPorUsuario(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
  //notis de solicitudes admin(2) y director (3)
  getNotificacionesPorRol(rol: number): Observable<Notificacion[]> {
  return this.http.get<Notificacion[]>(`${this.apiUrl}/rol/${rol}`);
}

}


