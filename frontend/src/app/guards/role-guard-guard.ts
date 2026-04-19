// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

// @Injectable({ providedIn: 'root' })
// export class RoleGuard implements CanActivate {

//   constructor(private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {

//     const expectedRole = route.data['role'];
//     const currentRole = localStorage.getItem('role');

//     if (currentRole === expectedRole) {
//       return true;
//     }

//     alert("Access Denied!");
//     this.router.navigate(['/']);
//     return false;
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['role'];
    const token = localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');

    // 🔒 Not logged in
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // 🔒 Role mismatch
    if (currentRole !== expectedRole) {
      alert("Access Denied!");
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}