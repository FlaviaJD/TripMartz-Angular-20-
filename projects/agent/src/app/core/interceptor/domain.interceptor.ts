import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { SwalService } from '../services/swal.service';
import { FlightService } from '../../modules/search/flight/flight.service';

@Injectable({ providedIn: 'root' })
export class DomainInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private swalService: SwalService,
    private flightService: FlightService
  ) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let REQ_URL = req.url;
    if (!this.isValidUrl(REQ_URL)) {
      REQ_URL = "http://www.example.com" + req.url
    }
    const pathname = new URL(REQ_URL).pathname;
    const skipAuth = [
      '/uat/b2b/user/service/validateOTP',
      '/uat/webservice/dcb/validateOTP',
      '/uat/webservice/dcb/employeeLogin',
      '/uat/b2b/user/service/UserLogin',
      '/uat/b2b/common/staticPageContentsList',
      '/uat/b2b/common/sliderSettingsList',
      '/uat/b2b/user/service/register',
      '/uat/b2b/common/UserTitleList',
      '/uat/sa/common/CountryList',
      '/uat/b2b/usermanagent/addAgent',
      '/uat/b2b/user/service/activate',
      '/uat/b2b/usermanagent/updateAgent',
      // '/b2b/user/service/resetPassword',
      '/uat/webservice/common/approvarBooking',
      '/uat/b2b/common/ManageDomain',
      '/uat/b2b/user/service/forgotPassword',
      '/uat/b2b/user/service/updatePassword',
      '/uat/b2b/core/core-airline-hotel-partners/activeAirlineHotelPartnersList',
      '/uat/webservice/feedback/create'
      // '/b2b/account-system/balanceRequestList'
    ];
    if (skipAuth.indexOf(pathname) !== -1) {
      return next.handle(req);
    }
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (!currentUser.hasOwnProperty('access_token')) {
      this.authService.logout();

      return EMPTY;
    }
    const modifiedReq = req.clone({
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + currentUser['access_token']
      }),

    });
    return next.handle(modifiedReq)
      .pipe(
        tap(evt => {
          if (evt instanceof HttpResponse) {
            if (evt.status == 401) {
              this.authService.logout();
            }
          }
        }),
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status == 401) {
              this.authService.logout();
            } else {
              return (this.handleError(err));
            }
          }
          return of(err);
        })
      );
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    return throwError(error);
  }


  isValidUrl(str: string) {
    try {
      new URL(str);
    } catch (_) {
      return false;
    }

    return true;
  }


}
