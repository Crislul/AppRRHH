import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
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
    apellidoM?: string;
    apellidoP?: string; 
    nombre?: string; 
    id?: number;
  }> {
    return this.http.post<{ 
      autenticado: boolean; 
      tipoUsuario?: number;
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
   return tipoUsuario === '2' ? 'admin' : 'user';
   }

  /* descomentar despues de hacer pruebas 

  obtenerRol(): string {
   const tipoUsuario = localStorage.getItem('tipoUsuario');
  return tipoUsuario === '2' ? 'admin' : 'user';
  }


    obtenerRol(): string {
   return 'admin';
  }
  
  */
  

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

  obtenerId(): number {
    const idUsuario = sessionStorage.getItem('idUsuario');
    return idUsuario ? Number(idUsuario) : 0;  // Convierte a número o retorna 0 si es null
  }
  
  

  cerrarSesion(): void {
    sessionStorage.clear();
  }

}
