import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiHandlerService } from '../core/api-handlers';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { FlightService } from '../modules/search/flight/flight.service';
import { ThemeOptions } from '../theme-options';

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
    public b2bUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public currentUserPreviliges: BehaviorSubject<any>;
    public token: any = '';
    private subSunk = new SubSink();

    constructor(
        private router: Router,
        private http: HttpClient,
        private apiHandlerService: ApiHandlerService,
        private flightService:FlightService,
        public globals: ThemeOptions
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')) || {});
        this.b2bUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')) || {});
        this.currentUser = this.currentUserSubject.asObservable();
        this.currentUserPreviliges = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userPrevilige')));
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    onActivate(email): Observable<any> {
        return this.apiHandlerService.apiHandler('agentActivate', 'post', '', '', { email }).pipe(map(res => res));
    }

    onLogin(login_id:string,username: string, password: string): Observable<any> {
        return this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
            login_id:login_id,
            email: username,
            password: password,
            role_id: [2, 3]
        }).pipe(map(res => {
            if (res['statusCode']) {
               this.removeBookingRequest();
               localStorage.setItem('currentUser', JSON.stringify(res['data']));
               this.currentUserSubject.next(res['data']);
                this.getPreviligesForUser(res['data']['id']);
                localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                /* BOF Added for refresh token concept */
                this.token = setInterval(() => {
                    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                    if (!currentUser.hasOwnProperty('access_token')) {
                        clearInterval(this.token);
                    }
                    this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
                        token: currentUser['access_token']
                    }).pipe(
                        map(res => {
                            localStorage.setItem('currentUser', JSON.stringify(res['data']));
                           // this.removeBookingRequest();
                            localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                            this.currentUserSubject.next(res['data']);
                            this.getPreviligesForUser(res['data']['id']);
                        })
                    );
                }, res['JwtexpiresInSeconds'] - 10);
                /* EOF Added for refresh token concept */
            }
            return res;
        }));
    }


    onDCBLogin(login_id:string): Observable<any> {
        return this.apiHandlerService.apiHandler('dcbLogin', 'POST', '', '', {
            employeeId:login_id,
        }).pipe(map(res => {
            return res;
        }));
    }

    validateOTP(email: string,login_id:string,otp: string): Observable<any> {
        return this.apiHandlerService.apiHandler('validateOTP', 'POST', '', '', {
            email: 'badri.provab@gmail.com',
            login_id:login_id,
            otp: otp
        }).pipe(map(res => {
            if (res['statusCode']) {
               this.removeBookingRequest();
                localStorage.setItem('currentUser', JSON.stringify(res['data']));
                this.currentUserSubject.next(res['data']);
                this.getPreviligesForUser(res['data']['id']);
                localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                /* BOF Added for refresh token concept */
                this.token = setInterval(() => {
                    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                    if (!currentUser.hasOwnProperty('access_token')) {
                        clearInterval(this.token);
                    }
                    this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
                        token: currentUser['access_token']
                    }).pipe(
                        map(res => {
                           // this.removeBookingRequest();
                            localStorage.setItem('currentUser', JSON.stringify(res['data']));
                            localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                            this.currentUserSubject.next(res['data']);
                            this.getPreviligesForUser(res['data']['id']);
                        })
                    );
                }, res['JwtexpiresInSeconds'] - 10);
                /* EOF Added for refresh token concept */
            }
            return res;
        }));
    }

    validateDCBOTP(login_id:string,otp: string): Observable<any> {
        return this.apiHandlerService.apiHandler('validateDCBOTP', 'POST', '', '', {
            user_id:login_id,
            otp: otp
        }).pipe(map(res => {
            this.setResponse(res);
            return res;
        }));
    }

    setResponse(res){
        if (res['statusCode']) {
            this.removeBookingRequest();
             localStorage.setItem('currentUser', JSON.stringify(res['data']));
             this.currentUserSubject.next(res['data']);
             this.getPreviligesForUser(res['data']['id']);
             localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
             /* BOF Added for refresh token concept */
             this.token = setInterval(() => {
                 const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
                 if (!currentUser.hasOwnProperty('access_token')) {
                     clearInterval(this.token);
                 }
                 this.apiHandlerService.apiHandler('userLogin', 'POST', '', '', {
                     token: currentUser['access_token']
                 }).pipe(
                     map(res => {
                        // this.removeBookingRequest();
                         localStorage.setItem('currentUser', JSON.stringify(res['data']));
                         localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
                         this.currentUserSubject.next(res['data']);
                         this.getPreviligesForUser(res['data']['id']);
                     })
                 );
             }, res['JwtexpiresInSeconds'] - 10);
             /* EOF Added for refresh token concept */
         }

    }
    

    removeBookingRequest(){
        this.globals.hideOther = false;
        localStorage.removeItem('bookingRequest');
        localStorage.removeItem('isBookingRequestSubmitted');
    }
    
    setLoginUser(data) {
        localStorage.setItem('currentUser', JSON.stringify(data.User));
        this.currentUserSubject.next(data.User);
        this.getPreviligesForUser(data.User.id);
        // data.BookingRequest.ProductType='Hotel';
        localStorage.setItem('bookingRequest', JSON.stringify(data.BookingRequest));
        localStorage.setItem('SelectedMenu', JSON.stringify({ activeMenu: 'searchMenus' }));
        if (data.BookingRequest.ProductType == 'Train') {
            this.flightService.goToDashboardTabs.next('Train');
        }
        if (data.BookingRequest.ProductType == "Hotel") {
            this.flightService.goToDashboardTabs.next('Raiserequest');
        }
        this.globals.hideOther = true;
        this.flightService.isredirrection.next(true);
        this.router.navigate(['/dashboard/search-form']);
        /* BOF Added for refresh token concept */
    }

    getPreviligesForUser(id) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPrivilegedUser', 'post', {}, {}, { 'user_id': id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    localStorage.setItem('userPrevilige', JSON.stringify(resp.data))
                }
            });
    }

    getStaticContent(title): Observable<any> {
        return this.apiHandlerService.apiHandler('staticPageContentsList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }));
    }

    airlineHotelPartnersList(title): Observable<any> {
        return this.apiHandlerService.apiHandler('activeAirlineHotelPartnersList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }));
    }

    getSliderList(title): Observable<any> {
        return this.apiHandlerService.apiHandler('sliderSettingsList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }));
    }

    getDomainInfo(title): Observable<any> {
        return this.apiHandlerService.apiHandler('ManageDomain', 'POST', '', '', title).pipe(map(res => {
            return res;
        }),
            catchError(err => {
                if (err instanceof HttpErrorResponse) {

                }
                return of(err);
            }));
    }
    getAirline(title): Observable<any> {
        return this.apiHandlerService.apiHandler('activeAirlineHotelPartnersList', 'POST', '', '', title).pipe(map(res => {
            return res;
        }),
            catchError(err => {
                if (err instanceof HttpErrorResponse) {

                }
                return of(err);
            }));
    }

    forgotPassword(req): Observable<any> {
        return this.apiHandlerService.apiHandler('sliderSettingsList', 'POST', '', '', req).pipe(map(res => {

            return res;
        }));
    }

    logout() {
        clearInterval(this.token);
        localStorage.clear();
        localStorage.clear();
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('SelectedMenu');
        this.currentUserSubject.next(null);
        if(this.globals.hideOther){
            this.removeBookingRequest();
            window.location.href='https://cldilmobilapp01.insurancearticlez.com/ILMASUAT/account/logon?returnUrl=%2FILMASUAT%2F';
        }
        else{
            this.removeBookingRequest();
            this.router.navigate(['/auth/login']);
        }
    }

    reloadCurrentRoute() {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }
      
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}