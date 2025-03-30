import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Salida{
  id: number;

  horaSalida: string;
  horaEntrada: string;
  horarioTrabajo: string;

  lugar: string;
  asunto: string;
  fecha: string;

  usuarioId: number;
  usuarioNombre: string; 
  usuarioApellidoP: string; 
  usuarioApellidoM: string; 

  areaId: number;
  areaNombre: string;  

  categoriaId: number;
  categoriaNombre: string;  
    
  estatus: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private apiUrl = 'https://localhost:7064/api/autorizacion';
  private usuariosUrl = 'https://localhost:7064/api/usuarios';
  private areasUrl = 'https://localhost:7064/api/area';
  private categoriasUrl = 'https://localhost:7064/api/categoria';

  constructor(private http: HttpClient) { }

  getAutorizaciones(idUsuario?: number): Observable<Salida[]> { 
      let params = new HttpParams();
    
      if (idUsuario) {
        params = params.set('idUsuario', idUsuario.toString());
      }
    
      return this.http.get<Salida[]>(this.apiUrl, { params });
    }
    
  
    getAutorizacion(id: number): Observable<Salida> {
      return this.http.get<Salida>(`${this.apiUrl}/${id}`);
    }
  
    createAutorizacion(salida: Salida): Observable<any> {
      return this.http.post<Salida>(`${this.apiUrl}`, salida);
    }
  
    updateAutorizacion(id: number, salida: Salida): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/${id}`, salida);
    }
  
    deleteAutorizacion(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }



    // get Area, categoria, Usuario
  
    ObtenerUsuarios(): Observable<any[]> {
      return this.http.get<any[]>(this.usuariosUrl);
    }
  
    getAreas(): Observable<any[]> {
      return this.http.get<any[]>(this.areasUrl);
    }
  
    getCategorias(): Observable<any[]> {
      return this.http.get<any[]>(this.categoriasUrl);
    }
}
