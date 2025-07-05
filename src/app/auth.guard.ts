import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user-service.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const user = userService.getUserLogged();

  const isLogged = user.email !== '';

  if (isLogged) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
