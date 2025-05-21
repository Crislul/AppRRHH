import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { TablaSalidasHoyDirComponent } from "../tabla-salidas-hoy-dir/tabla-salidas-hoy-dir.component";
import { TablaIncidenciasHoyDirComponent } from "../tabla-incidencias-hoy-dir/tabla-incidencias-hoy-dir.component";

@Component({
  selector: 'app-index-director',
  imports: [
    RouterModule,
    MatButtonModule,
    FooterComponent,
    TablaSalidasHoyDirComponent,
    TablaIncidenciasHoyDirComponent
],
  templateUrl: './index-director.component.html',
  styleUrl: './index-director.component.css'
})
export class IndexDirectorComponent {


}
