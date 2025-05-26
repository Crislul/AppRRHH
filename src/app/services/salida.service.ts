import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Salida{
  id: number;

  horaSalida: string;
  horaEntrada: string;
  horarioTrabajo: string;

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
    
  estatusDir: number;
  estatusAdmin: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalidaService {

  private apiUrl = 'https://apirrhh.onrender.com/autorizacion';
  private usuariosUrl = 'https://apirrhh.onrender.com/api/usuarios';
  private areasUrl = 'https://apirrhh.onrender.com/api/area';
  private categoriasUrl = 'https://apirrhh.onrender.com/api/categoria';

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
