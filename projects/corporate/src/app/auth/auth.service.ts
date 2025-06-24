import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApiHandlerService } from '../core/api-handlers';
import { SubSink } from 'subsink';
import { untilDestroyed } from '../core/services/until-destroyed';
import { Router } from '@angular/router';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public currentUserPreviliges: BehaviorSubject<any>;
    public token: any = '';
    private subSunk = new SubSink();
    subscriptions: Subscription;

    constructor(
        private http: HttpClient,
        private apiHandlerService: ApiHandlerService,
        private router: Router,
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentCorpUser')));
        this.currentUserPreviliges = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userPrevilige')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    getUserPermissions() {
        return this.apiHandlerService.apiHandler('getPrivilegedUser', 'POST', '', '', {
            'user_id': JSON.parse(localStorage.getItem('currentCorpUser'))['id']
        }).pipe(delay(100));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    onLogin(username: string, password: string): Observable<any> {
        return this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
            email: username,
            password: password,
            login_type:'CORPORATE',
            role_id:[7,10]
        }).pipe(map(res => {
            if (res['statusCode'] == 200 && res['data']['access_token'] != undefined) {
                localStorage.setItem('currentCorpUser', JSON.stringify(res['data']));
                this.currentUserSubject.next(res['data']);
                this.getPreviligesForUser(res['data']['id']);
                /* BOF for refresh token concept */
                this.token = setInterval(() => {
                    let currentUser = JSON.parse(localStorage.getItem('currentCorpUser')) || {};
                    if (!currentUser.hasOwnProperty('access_token')) {
                         clearInterval(this.token);
                    }
                    else {
                        this.apiHandlerService.apiHandler('refreshToken', 'POST', '', '', {
                            token: currentUser['access_token']
                        }).pipe(
                            untilDestroyed(this)
                        ).subscribe(resp => {
                            localStorage.removeItem('currentCorpUser');
                            currentUser['access_token'] = resp['data']['access_token'];
                            localStorage.setItem('currentCorpUser', JSON.stringify(currentUser));
                            this.currentUserSubject.next(currentUser);
                            // return;
                        });
                    }
                }, 660000);
                /* EOF for refresh token concept */
            }
            return res;
        }));
    }

    getPreviligesForUser(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPrivilegedUser', 'post', {}, {}, { 'user_id': id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    localStorage.setItem('userPrevilige', JSON.stringify(resp.data))
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentCorpUser');
        localStorage.removeItem('userPrevilige');
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}