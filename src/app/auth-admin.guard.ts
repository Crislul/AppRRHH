import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SeguridadService } from './services/seguridad.service';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const seguridadService = inject(SeguridadService);

  if (seguridadService.obtenerRol() === 'admin')
  {
    return true;
  }

  router.navigate(['/Help']);
  return true;
};
