import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../app/auth/auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.getToken()) return true; // Valid session allowed

  return router.parseUrl('/auth'); // Redirect to login if unauthorized
};
