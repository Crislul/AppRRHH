import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MenuComponent } from './menu/menu/menu.component';
import { MainComponent } from "./main/main.component";
import { ToolbarComponent } from "./toolbar/toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { SeguridadService } from './services/seguridad.service';
import { LoginComponent } from "./login/login/login.component";
import { MenuUserComponent } from "./menu/menu-user/menu-user.component";



@Component({
  selector: 'app-root',
  imports: [
    MenuComponent, 
    MainComponent, 
    ToolbarComponent, 
    CommonModule, 
    LoginComponent, 
    MenuUserComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  seguridadService = inject(SeguridadService);

  estaAutorizado(): boolean{
    return this.seguridadService.estaLogeado();
  }

  tipoUsuario(): string{
    return this.seguridadService.obtenerRol();
  }

  

  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);


  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }


  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
    

}
