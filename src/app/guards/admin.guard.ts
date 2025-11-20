import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => {
      if (!isAuth) {
        // Si no está autenticado, redirigir a login
        return router.createUrlTree(['/login']);
      }

      const role = authService.getRole();
      
      if (role === 'ADMIN') {
        // Si es admin, permitir acceso
        return true;
      } else {
        // Si no es admin, redirigir a home
        alert('Acceso denegado: Se requieren permisos de administrador');
        return router.createUrlTree(['/home']);
      }
    })
  );
};