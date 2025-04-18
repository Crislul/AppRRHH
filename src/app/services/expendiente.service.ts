import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Expediente {

  id : number;
  usuarioId : number;
}

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  private apiUrl = 'https://localhost:7064/api/Expediente'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

  subirExpediente(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/subir`, formData);
  }

  obtenerDocumentosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
  eliminarDocumento(usuarioId: number, id : number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuario/${usuarioId}/${id}`);
  }
  actualizarDocumento(usuarioId: number, id: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/usuario/${usuarioId}/${id}`;
    return this.http.put(url, formData);
  }
  
}
