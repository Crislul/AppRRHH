import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { TablaSalidasHoyUserComponent } from "../tabla-salidas-hoy-user/tabla-salidas-hoy-user.component";
import { TablaIncidenciasHoyUserComponent } from "../tabla-incidencias-hoy-user/tabla-incidencias-hoy-user.component";

@Component({
  selector: 'app-index-user',
  imports: [
    MatButtonModule,
    TablaSalidasHoyUserComponent,
    TablaIncidenciasHoyUserComponent
],
  templateUrl: './index-user.component.html',
  styleUrl: './index-user.component.css'
})
export class IndexUserComponent {

    constructor( 
    private router: Router
  ) {}

  incidenciaRoute(){

    this.router.navigate(['/generar/incidencia']);
  }
  salidaRoute(){

    this.router.navigate(['/generar/salida']);
  }

}
