import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/authService';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.isActive()) {
      this.router.navigate(['/inactive']);
      return false;
    }

    const requiredRoles = route.data['role'] as string[];
    const userRole = this.authService.getRole();

    if (requiredRoles && userRole) {
      if (userRole === 'Admin') {
        return true;
      }

      if (!requiredRoles.includes(userRole)) {
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    return true;
  }
}
