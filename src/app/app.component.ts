import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { MenuComponent } from './menu/menu/menu.component';
import { MainComponent } from "./main/main.component";
import { ToolbarComponent } from "./toolbar/toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { SeguridadService } from './services/seguridad.service';
import { LoginComponent } from "./login/login/login.component";
import { MenuUserComponent } from "./menu/menu-user/menu-user.component";
import { ToolbarUserComponent } from './toolbar/toolbar-user/toolbar-user.component';
import { ToolbarDirectorComponent } from "./toolbar/toolbar-director/toolbar-director.component";
import { MenuDirectorComponent } from './menu/menu-director/menu-director.component';



@Component({
  selector: 'app-root',
  imports: [
    MenuComponent,
    MainComponent,
    ToolbarComponent,
    CommonModule,
    LoginComponent,
    ToolbarUserComponent,
    ToolbarDirectorComponent,
    MenuUserComponent,
    MenuDirectorComponent,
 
],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  seguridadService = inject(SeguridadService);

  estaAutorizado(): boolean {
    const isLoggedIn = this.seguridadService.estaLogeado();
    
    // Si el usuario está logeado, verifica que ya se hizo la redirección
    if (isLoggedIn) {
      const rutaActual = window.location.pathname;
      if (rutaActual === '/login') {
        return false; // Evita mostrar el index si la redirección aún no ocurrió
      }
    }
  
    return isLoggedIn;
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
