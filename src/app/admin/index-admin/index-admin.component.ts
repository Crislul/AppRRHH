import { Component } from '@angular/core';
import {Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-index-admin',
  imports: [RouterModule],
  templateUrl: './index-admin.component.html',
  styleUrl: './index-admin.component.css'
})
export class IndexAdminComponent {

  constructor(private router: Router) {}

  incidenciaroute(){
    //console.log('Redireccionando...');

    this.router.navigate(['/generarIncidenciaAdmin']);
  }
  salidaroute(){
    //console.log('Redireccionando...');

    this.router.navigate(['/generarSalidaAdmin']);
  }
  usuarioroute(){
    //console.log('Redireccionando...');

    this.router.navigate(['/generarUsuario']);
  }
}
