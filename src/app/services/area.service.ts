import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Area {
  id: number;
  nombre: string;
}


export interface CreateAreaDto {
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private apiUrl = 'https://localhost:7064/api/area'; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl);
  }

  getArea(id: number): Observable<Area> {
    return this.http.get<Area>(`${this.apiUrl}/${id}`);
  }

  createArea(area: CreateAreaDto): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area);
  }

  updateArea(id: number, area: CreateAreaDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, area);
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
