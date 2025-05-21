import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService {


  private apiUrl = 'https://localhost:7064/api/auth/login'; // Cambia al puerto correcto de tu API

  constructor(private http: HttpClient) {

  }

  login(correo: string, contrasenaHash: string): 
  Observable<{ 
    autenticado: boolean; 
    tipoUsuario?: number;
    areaUsuario?: number;
    apellidoM?: string;
    apellidoP?: string; 
    nombre?: string; 
    id?: number;
  }> {
    return this.http.post<{ 
      autenticado: boolean; 
      tipoUsuario?: number;
      areaUsuario?: number;
      apellidoM?: string;
      apellidoP?: string; 
      nombre?: string; 
      id?: number; 
    }>(this.apiUrl, {
      correo,
      contrasenaHash
    }).pipe(
      tap(resp => {
        if (resp.autenticado) {
          sessionStorage.setItem('autenticado', 'true');
          sessionStorage.setItem('tipoUsuario', String(resp.tipoUsuario));
          sessionStorage.setItem('areaUsuario', String(resp.areaUsuario));
          sessionStorage.setItem('apellidoMUsuario', String(resp.apellidoM));
          sessionStorage.setItem('apellidoPUsuario', String(resp.apellidoP));
          sessionStorage.setItem('nombreUsuario', String(resp.nombre));
          sessionStorage.setItem('idUsuario', String(resp.id));


          if (resp.tipoUsuario === 1) {
            setTimeout(() => {
              this.cerrarSesion();
            }, 30 * 60 * 1000); // 30 minutos en milisegundos
          }
        }
      })
    );
  }

  estaLogeado(): boolean {
    return sessionStorage.getItem('autenticado') === 'true';
  }


  obtenerRol(): string {
    const tipoUsuario = sessionStorage.getItem('tipoUsuario');
    switch (tipoUsuario) {
      case '2':
        return 'admin';
      case '3':
        return 'director';
      default:
        return 'user';
    }
  }

  obtenerNombre(): string {
    const nombre1 = sessionStorage.getItem('nombreUsuario');
    return nombre1 ?? '';  // Retorna un string vacío si el valor es null
  }

  obtenerApellidoP(): string {
    const nombre1 = sessionStorage.getItem('apellidoPUsuario');
    return nombre1 ?? '';  // Retorna un string vacío si el valor es null
  }

  obtenerApellidoM(): string {
    const nombre1 = sessionStorage.getItem('apellidoMUsuario');
    return nombre1 ?? '';  // Retorna un string vacío si el valor es null
  }

  obtenerAreaUser(): number {
    const areaUsuario = sessionStorage.getItem('areaUsuario');
    return areaUsuario ? Number(areaUsuario) : 0;  // Convierte a número o retorna 0 si es null
  }

  obtenerId(): number {
    const idUsuario = sessionStorage.getItem('idUsuario');
    return idUsuario ? Number(idUsuario) : 0;  // Convierte a número o retorna 0 si es null
  }
  
  

  cerrarSesion(): void {
    sessionStorage.clear();
  }

}
