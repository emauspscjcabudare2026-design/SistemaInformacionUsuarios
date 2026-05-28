import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Role } from '../../models/role.model';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    await authService.waitUntilAuthReady();

    const appUser = authService.appUser();

    if (!appUser || !appUser.active) {
      return router.createUrlTree(['/login']);
    }

    if (!allowedRoles.includes(appUser.role)) {
      return router.createUrlTree([`/${appUser.role}`]);
    }

    return true;
  };
};
