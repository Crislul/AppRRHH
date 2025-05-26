import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Incidencia {
  id: number;
  descripcion: string;
  fecha: string;
  fechaInicio: string;
  fechaFin: string;
  usuarioId: number;
  usuarioNombre: string; 
  usuarioApellidoP: string; 
  usuarioApellidoM: string; 
  areaId: number;
  areaNombre: string;  
  categoriaId: number;
  categoriaNombre: string;  
  motivoId: number;
  motivoNombre: string;  
  estatusDir: number;
  estatusAdmin: number;
  archivo?: string;
  nombreArchivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  
  private apiUrl = 'https://apirrhh.onrender.com/api/incidencia';
  private usuariosUrl = 'https://apirrhh.onrender.com/api/usuarios';
  private areasUrl = 'https://apirrhh.onrender.com/api/area';
  private categoriasUrl = 'https://apirrhh.onrender.com/api/categoria';
  private motivosUrl = 'https://apirrhh.onrender.com/api/motivo';

  constructor(private http: HttpClient) {}

  getIncidencias(idUsuario?: number): Observable<Incidencia[]> { 
    let params = new HttpParams();
  
    if (idUsuario) {
      params = params.set('idUsuario', idUsuario.toString());
    }
  
    return this.http.get<Incidencia[]>(this.apiUrl, { params });
  }
  

  getIncidencia(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.apiUrl}/${id}`);
  }

  createIncidencia(incidencia: Incidencia): Observable<any> {
    return this.http.post<Incidencia>(`${this.apiUrl}`, incidencia);
  }

  updateIncidencia(id: number, incidencia: Incidencia): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, incidencia);
  }

  deleteIncidencia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  // get Area, categoria, motivo, Usuario

  ObtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuariosUrl);
  }

  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(this.areasUrl);
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.categoriasUrl);
  }

  getMotivos(): Observable<any[]> {
    return this.http.get<any[]>(this.motivosUrl);
  }

  // subir archivo
  uploadFile(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);
  
    return this.http.post(`${this.apiUrl}/subir-archivo/${id}`, formData);
  }
  
  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/descargar-archivo/${id}`, {
      responseType: 'blob' // Recibir el archivo como Blob
    });
  }
  
}
