import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const organizadorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map(isAuth => {
      if (!isAuth) {
        // Si no está autenticado, redirigir a login
        return router.createUrlTree(['/login']);
      }

      const role = authService.getRole();
      
      // Permitir acceso a ORGANIZADOR
      if (role === 'ORGANIZADOR' ) { // Podemos hacer || role === 'ADMIN' si queremos que admin también pueda acceder
        return true;
      } else {
        // Si no es organizador, redirigir a home
        alert('Acceso denegado: Se requieren permisos de organizador');
        return router.createUrlTree(['/home']);
      }
    })
  );
};