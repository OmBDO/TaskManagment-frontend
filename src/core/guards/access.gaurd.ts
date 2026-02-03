import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../../app/auth/auth.service';
import { UserRole } from '../enums/Role';
import { ErrorCode } from '../error/status.code';

export const accessAdminGaurd = (): UrlTree | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if ((authService.authUser()?.roles[0] ?? UserRole.User) == UserRole.Administrator) return true;

  return router.createUrlTree([
    '/error',
    ErrorCode.Forbidden,
    'Access to User for this path is forbidden',
  ]);
};
