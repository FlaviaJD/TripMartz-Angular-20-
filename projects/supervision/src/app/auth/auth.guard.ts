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
        let currentPath = state.url;
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser['auth_role_id'] == 3) {
            const previliges = JSON.parse(localStorage.getItem('userPrevilige'))
            const activeArr = ['active', 'inactive-list','in-active'];
            const authUrls = ['auth/login', 'auth/login/', '/auth/login', 'auth/login/', "", "/"]
            currentPath = currentPath.substring(1);
            if (authUrls.includes(currentPath))
                return true;
            let a = currentPath.split("/");
            if (activeArr.includes(a[a.length - 1]) || activeArr.includes(a[a.length - 1].split("?")[0])) {
                a.pop();
            }
            currentPath = a.join("/");
            if (previliges.some(e => currentPath == (e.url) || (currentPath + "/") == e.url)) {
                return true
            }
            this.router.navigate(['/'], {});
            return false;
        } else {
            return true;
        }
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            return true;
        }
        this.router.navigate(['/auth/login'], {});
        return false;
    }


}