import { select } from '@angular-redux/store';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { AppService } from 'projects/supervision/src/app/app.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../auth/auth.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { FlightService } from '../../../modules/search/flight/flight.service';
import { ThemeOptions } from '../../../theme-options';
import { HeaderService } from './header.service';

const baseUrl2 = environment.B2B_URL;
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    logoUri = baseUrl2;
    public bellIcon: string = "assets/images/login-images/assets/bell.png";
    public userProfileLogoAvatar: string = "assets/images/login-images/assets/profile_logo.png";
    public userProfileLogo: string = "assets/images/avatars/1.jpg";
    isFlight: boolean=false;
    isHotel: boolean=false;
    isBus: boolean=false;
    currentModule: any;
    @HostBinding('class.isActive')
    get isActiveAsGetter() {
        return this.isActive;
    };
    defaultCurrency: string = '';
    subSink = new SubSink();

    isActive: boolean;
    isMobile = false;
    isBookingRequestSubmitted:boolean=false;

  getIsMobile(): boolean {
    const w = document.documentElement.clientWidth;
    const breakpoint = 992;
    if (w > breakpoint) {
      return true;
    } else {
      return false;
    }
  }
  onclick()
  {
    this.isMobile = !this.isMobile
  }

    @select('config') public config$: Observable<any>;
    currentUser: any = {};
    domainInformation: any;
    agentData: any;
    navigationData: any;
    hideOther:boolean=false;
    desableTrain:boolean=false;
    desableHotel:boolean=false;
    browserRefresh: boolean;

    constructor(
        public globals: ThemeOptions,
        private authService: AuthService,
        private router: Router,
        private appService: AppService,
        private apiHandlerService: ApiHandlerService,
        private headerService: HeaderService,
        private flightService:FlightService,
        private cdr: ChangeDetectorRef,
    ) {
           this.defaultCurrency = this.appService.defaultCurrency;
    }

    ngOnInit() {
        this.headerService.selectedModule.subscribe(value=> {
            this.currentModule=value;
        });

        this.isMobile = this.getIsMobile();
        this.hideOther = this.globals.hideOther;
        this.setValue();
        window.onresize = () => {
            this.isMobile = this.getIsMobile();
        };
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const modules = this.currentUser.corporate_details.module;
        if(modules)
        {
        this.isFlight = modules.includes('Flight') && this.currentUser['auth_role_id']!=3;
        this.isHotel = modules.includes('Hotel') && this.currentUser['auth_role_id']!=3;
        this.isBus = modules.includes('Bus') && this.currentUser['auth_role_id']!=3;
        }
        else{
            this.isFlight=true;
            this.isHotel=true;
            this.isBus=true;
        }
        if (this.currentUser ['auth_role_id'] == 5)
        this.getPrevilegeForThisUser();
        this.authService.b2bUserSubject.subscribe(user => {
            if (user) {
                this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            } else {
                this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            }

        });
        if (this.headerService.agentData.subscribe(data => {
            if (data) {
                this.getAgentById();
            }
        }))

            this.getDomain();
        
    }

    setValue() {
        let bookingRequest = JSON.parse(localStorage.getItem('bookingRequest')) || {};
        this.isBookingRequestSubmitted = JSON.parse(localStorage.getItem('isBookingRequestSubmitted')) || false;
        if (Object.keys(bookingRequest).length > 0) {
            this.globals.hideOther = true;
            this.hideOther = true;
        }
        if (this.hideOther) {
            if (bookingRequest.ProductType === "Train") {
                this.desableHotel = true;
                this.desableTrain=false
                this.flightService.goToDashboardTabs.next('Train');
            } else if (bookingRequest.ProductType === "Hotel") {
                this.desableTrain = true;
                this.desableHotel=false
                this.flightService.goToDashboardTabs.next('Raiserequest');
            }
        }
    }
    

    getAgentById() {
        if (this.currentUser) {
            let userId=this.currentUser.id;
            if (this.currentUser.auth_role_id && this.currentUser.auth_role_id==5){
                userId=this.currentUser.created_by_id; // Added to show agents balance to subagent
            }
            this.subSink.sink = this.apiHandlerService.apiHandler('getAgentById', 'POST', {}, {}, { "id": userId })
                .subscribe(res => {
                    if (res.statusCode == 200 || res.statusCode == 201) {
                        this.agentData = res.data;
                    }
                });
        }
    }

    toggleSidebarMobile() {
        this.globals.toggleSidebarMobile = !this.globals.toggleSidebarMobile;
    }

    toggleHeaderMobile() {
        this.globals.toggleHeaderMobile = !this.globals.toggleHeaderMobile;
    }
    onLogout() {
        this.updateLogoutTime();
        this.authService.logout();

    }
    updateLogoutTime() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateLogouttime', 'post', {}, {},
            { "logout_datetime": formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss') })
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {

                }
            })
    }
    toggleDrawer() {
        this.globals.toggleDrawer = !this.globals.toggleDrawer;
    }
    onBalanceClick() {
        this.router.navigate(["payment/make-payment"])
    }
    onCreditLimitClick() {
        this.router.navigate(["payment/update-credit-limit"])
    }

    getDomain() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('ManageDomain', 'post', {}, {},
            {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.domainInformation = resp.data[0];

                }
            })
    }

    getPrevilegeForThisUser() {
        this.navigationData = JSON.parse(localStorage.getItem('userPrevilige'))
      }

      isMenuExists(menu) {
        if (this.navigationData && this.navigationData.length > 0) {
          if (this.navigationData.some((el) => el.description == menu)) return true;
          else return false;
        } else {
          return true;
        }
      }

      setModule(module){
        this.currentModule=module;
        this.headerService.selectedModule.next(module);
        this.router.navigate(['/dashboard/search-form']);
        this.flightService.emitChange(module);
      }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
