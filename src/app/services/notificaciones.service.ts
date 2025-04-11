import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  leido: boolean;
  
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private apiUrl = 'https://localhost:7064/api/notificaciones';

  constructor(private http: HttpClient) {}

  
  getNotificaciones(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.apiUrl);
  }
  
  marcarNotificacionComoLeida(id: number) {
    return this.http.put(`${this.apiUrl}/notificaciones/${id}/leida`, {});
  }
  eliminarnotificacion(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}


