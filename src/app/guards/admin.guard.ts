import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

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
        Swal.fire({
          title: "Acceso denegado",
          text: "Se requieren permisos de administrador",
          icon: "warning",
          draggable: true
        });
        return router.createUrlTree(['/home']);
      }
    })
  );
};