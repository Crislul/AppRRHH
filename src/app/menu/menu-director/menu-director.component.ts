import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-director',
  imports: [RouterModule, CommonModule],
  templateUrl: './menu-director.component.html',
  styleUrl: './menu-director.component.css'
})
export class MenuDirectorComponent {


  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();


  items = [
    {
      routeLink: 'indexDirector',
      icon: 'fa fa-home',
      label: 'Inicio'
    },
    {
      routeLink: 'tablaIncidenciasDirector',
      icon: 'fa-solid fa-list-check',
      label: 'Incidencias'
    },
    {
      routeLink: 'tablaSalidasDirector',
      icon: 'fa-solid fa-user-check',
      label: 'Autorización de salida'
    }
    
  ];

  

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  handleClick(event: Event, item: any, index: number) {
    if (this.isLeftSidebarCollapsed()) {
      if (item.submenu) {
        event.preventDefault(); // Evita la redirección
        this.toggleCollapse(); // Expande el menú lateral
      }
      // Si no es un submenú, el enlace redirigirá normalmente
    } else {
      // Si el menú no está colapsado, maneja el submenú como antes
      if (item.submenu) {
        event.preventDefault(); // Evita la redirección
      }
    }
  }
}

