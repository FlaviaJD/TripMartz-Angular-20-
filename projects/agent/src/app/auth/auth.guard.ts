import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authenticationService.currentUserValue;
        if (Object.keys(currentUser).length>0) {
            // authorised so return true
            return true;
        }
        else
        {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        // not logged in so redirect to login page with the return url
       
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authenticationService.currentUserValue;
        if (Object.keys(currentUser).length>0) {
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }


}