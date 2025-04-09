import { Component} from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import { TablaSalidasHoyComponent } from "../tabla-salidas-hoy/tabla-salidas-hoy.component";
import { TablaIncidenciaHoyComponent } from "../tabla-incidencia-hoy/tabla-incidencia-hoy.component";
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from "../../footer/footer.component";



@Component({
  selector: 'app-index-admin',
  imports: [
    RouterModule,
    TablaSalidasHoyComponent,
    TablaIncidenciaHoyComponent,
    MatButtonModule,
    FooterComponent
],
  templateUrl: './index-admin.component.html',
  styleUrl: './index-admin.component.css'
})
export class IndexAdminComponent  {

  constructor( 
    private router: Router
  ) {}


  incidenciaRoute(){

    this.router.navigate(['/generarIncidenciaAdmin']);
  }
  salidaRoute(){

    this.router.navigate(['/generarSalidaAdmin']);
  }

}
