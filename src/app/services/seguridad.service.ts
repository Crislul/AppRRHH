import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeguridadService implements OnDestroy {


  private apiUrl = 'https://localhost:7064/api/auth/login'; // Cambia al puerto correcto de tu API

  constructor(private http: HttpClient) {

    // Escuchar el evento beforeunload para borrar los datos al cerrar o recargar la página
    window.addEventListener('beforeunload', this.cerrarSesion.bind(this));
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
          localStorage.setItem('autenticado', 'true');
          localStorage.setItem('tipoUsuario', String(resp.tipoUsuario));
          localStorage.setItem('apellidoMUsuario', String(resp.apellidoM));
          localStorage.setItem('apellidoPUsuario', String(resp.apellidoP));
          localStorage.setItem('nombreUsuario', String(resp.nombre));
          localStorage.setItem('idUsuario', String(resp.id));


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
    return localStorage.getItem('autenticado') === 'true';
  }


  obtenerRol(): string {
    const tipoUsuario = localStorage.getItem('tipoUsuario');
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
    const nombre1 = localStorage.getItem('nombreUsuario');
    return nombre1 ?? 'Bruce';  // Retorna un string vacío si el valor es null
  }

  obtenerApellidoP(): string {
    const nombre1 = localStorage.getItem('apellidoPUsuario');
    return nombre1 ?? 'Wayne';  // Retorna un string vacío si el valor es null
  }

  obtenerApellidoM(): string {
    const nombre1 = localStorage.getItem('apellidoMUsuario');
    return nombre1 ?? 'Diaz';  // Retorna un string vacío si el valor es null
  }

  obtenerId(): number {
    const idUsuario = localStorage.getItem('idUsuario');
    return idUsuario ? Number(idUsuario) : 0;  // Convierte a número o retorna 0 si es null
  }
  
  

  cerrarSesion(): void {
    localStorage.removeItem('autenticado');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('idUsuario');
  }

  // Limpiar el evento beforeunload cuando el servicio se destruya
  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.cerrarSesion.bind(this));
  }

}
