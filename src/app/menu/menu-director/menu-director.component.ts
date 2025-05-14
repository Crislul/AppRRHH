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
      label: 'Inicio',
    },
    {
      label: 'Incidencias de la carrera',
      icon: 'fa-solid fa-person-circle-question',
      submenu: [
        { label: 'Incidencias', icon: 'fa-solid fa-list-check', routeLink: 'tablaIncidenciasDirector' },
      ],
      expanded: false
    },
    {
      label: 'Autorizaciones de salidas de la carrera',
      icon: 'fa-solid fa-person-running',
      submenu: [
        { label: 'Autorización de salida', icon: 'fa-solid fa-user-check', routeLink: 'tablaSalidasDirector' },
      ],
      expanded: false
    },
    
  ];

  

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());

    if (this.isLeftSidebarCollapsed()) {
      this.items.forEach((item) => {
        if (item.submenu) {
          item.expanded = false; // Contraer el submenú
        }
      });
    }
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  toggleSubmenu(index: number) {
    this.items[index].expanded = !this.items[index].expanded;
  }

  handleClick(event: Event, item: any, index: number) {
    if (this.isLeftSidebarCollapsed()) {
      if (item.submenu) {
        event.preventDefault(); // Evita la redirección
        this.toggleCollapse(); // Expande el menú lateral
        this.toggleSubmenu(index); // Despliega el submenú
      }
      // Si no es un submenú, el enlace redirigirá normalmente
    } else {
      // Si el menú no está colapsado, maneja el submenú como antes
      if (item.submenu) {
        event.preventDefault(); // Evita la redirección
        this.toggleSubmenu(index); // Despliega el submenú
      }
    }
  }
}

