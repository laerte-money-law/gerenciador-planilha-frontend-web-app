import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRoleEnum } from '../models/enum/user-role.enum';
import { AppUrls } from '../../app.urls';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: UserRoleEnum[] = route.data?.['roles'];
  const userRole = authService.userInfo?.role as UserRoleEnum;

  if (authService.isLoggedIn() && allowedRoles.includes(userRole)) {
    if (authService.userInfo?.shouldRedefinePassword) {
      router.navigate([AppUrls.PATHS.AUTH.REDEFINE_PASSWORD()]);
      return false;
    }
    return true;
  }

  // Redirect to dashboard based on role or default to login
  if (userRole === UserRoleEnum.ADMIN || userRole === UserRoleEnum.CLIENT || userRole === UserRoleEnum.USER || userRole === UserRoleEnum.CONSULTANT) {
      // In a real app we might have different dashboards, but here we redirect to a safe default
      return true; // Or redirect specifically
  }

  router.navigate(['/auth/login']);
  return false;
};
