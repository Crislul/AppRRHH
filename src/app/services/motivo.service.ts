import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Motivo {
  id: number;
  nombre: string;
}

export interface CreateMotivoDto {
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})


export class MotivoService {
  private apiUrl = 'https://apirrhh.onrender.com/api/motivo'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getMotivos(): Observable<Motivo[]> {
    return this.http.get<Motivo[]>(this.apiUrl);
  }

  getMotivo(id: number): Observable<Motivo> {
    return this.http.get<Motivo>(`${this.apiUrl}/${id}`);
  }

  createMotivo(motivo: CreateMotivoDto): Observable<Motivo> {
    return this.http.post<Motivo>(this.apiUrl, motivo);
  }

  updateMotivo(id: number, motivo: CreateMotivoDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, motivo);
  }

  deleteMotivo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
