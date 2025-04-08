import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-user',
  imports: [
    MatButtonModule
  ],
  templateUrl: './index-user.component.html',
  styleUrl: './index-user.component.css'
})
export class IndexUserComponent {

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
