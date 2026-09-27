import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/onoma.services';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || inject(Router).createUrlTree(['/login']);
};

export const assessmentPendingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return !auth.currentUser.assessmentCompleted || inject(Router).createUrlTree(['/dashboard']);
};
