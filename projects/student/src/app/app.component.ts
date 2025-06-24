import { Component, OnDestroy, OnInit } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './auth/auth.service';
import { SwalService } from './core/services/swal.service';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiHandlerService } from './core/api-handlers';
import { SubSink } from 'subsink';
import { UtilityService } from './core/services/utility.service';

export let browserRefresh = false;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit, OnDestroy {
    title = 'Employee Panel';
    subscription: Subscription;
    private subSunk = new SubSink();
    currentUser: any;

    constructor(
        private router: Router,
        private bnIdle: BnNgIdleService,
        private swalService: SwalService,
        private authService: AuthService,
        private apiHandlerService: ApiHandlerService,
        private util: UtilityService
    ) {
        this.subSunk.sink = router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                browserRefresh = !router.navigated;
            }
        });
    }
    ngOnInit(): void {
        /* 24 minutes session idle time */
        this.subSunk.sink = this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
            if (isTimedOut) {
                this.authService.logout();
                this.bnIdle.stopTimer();
            } else {
            }
        });
        this.currentUser =  this.util.readStorage('studentCurrentUser', localStorage);
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }
}


