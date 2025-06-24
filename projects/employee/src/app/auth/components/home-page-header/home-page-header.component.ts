import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild,NgZone, EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { environment } from '../../../../environments/environment.prod';
import { AuthService } from '../../../auth/auth.service';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AlertService } from '../../../core/services/alert.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/employee/src/app/core/logger/logger.service';

const baseUrl = environment.SA_URL;

const loginPopup: NavigationExtras = {
    state: {
        status: true
    }
};
export class User {
    user_id: string;
    user_name: string;
    user_type: string;
    first_name: string;
    last_name: string;
    phone: string;
    country_code: string;
    status: string;
    user_profile_image: string;
    created_datetime: string;
    login_id: string;
    accessToken: string;
}

const log = new Logger('auth/HomePageHeaderComponent');

@Component({
    selector: 'app-home-page-header',
    templateUrl: './home-page-header.component.html',
    styleUrls: ['./home-page-header.component.scss']
})

export class HomePageHeaderComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
        public bannerImage: any = "assets/images/login-images/banner1.png";
        public layerBg: any = "assets/images/login-images/layers.png";
        public signUpBg: any = "assets/images/login-images/dark-blue-polygonal.png"
        public signUpBgLayer: any = "assets/images/login-images/bglayer.png"
        slideConfig2 = {
            infinite: false,
            slidesToShow: 1,
            speed: 500,
            dots: true,
        };
        closeResult = '';
        showCarousel = true;
        primaryColour: any;
        secondaryColour: any;
        loadingTemplate: any;
        isDCBLogin = false;
        loading = false;
        loaderb2b = true;
        submitted = false;
        returnUrl: string;
        loginForm: FormGroup;
        VerifyOtpForm: FormGroup;
        private currentUserSubject: BehaviorSubject<User>;
        public currentUser: Observable<User>;
        emailFormControl = new FormControl('', [
            Validators.required,
            Validators.email,
        ]);
        errorMessage = '';
        staticContentData: Array<any> = [];
        aboutUsData: any;
        imageData: Array<any> = [];
        textData: Array<any> = [];
        domainInfo: any;
        hotelPartners: any;
        airlinePartners: any;
        pageLoad = false;
        voucherUrl: any;
        showOtpComponent = false;
        isMenuOpen = false;
        isLoading = false;
        hidePassword = true;
    
   
          
        @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
        @Output() changeContent: EventEmitter<any> = new EventEmitter<any>();
        loadingLogin: boolean = false;
        
        constructor(
            private fb: FormBuilder,
            private apiHandlerService: ApiHandlerService,
            private authService: AuthService,
            private alertService: AlertService,
            private route: ActivatedRoute,
            private router: Router,
            private dialog: MatDialog,
            private cdr: ChangeDetectorRef,
            private location: Location,
            private modalService: NgbModal,
            private ngZone: NgZone,
            
        ) {
            let currentURL = window.location.href;
            if (localStorage.getItem('currentUser')) {
                this.router.navigate(['/dashboard']);
            } else {
                this.pageLoad = true;
            }
        }
    
    
        config = {
            allowNumbersOnly: true,
            length: 6,
            isPasswordInput: false,
            disableAutoFocus: false,
            placeholder: '',
            inputStyles: {
                'width': '50px',
                'height': '50px'
            }
        };
        
    
        loadSpinner() {
            if (this.isLoading) return;
        
            this.isLoading = true;
            this.cdr.detectChanges();
        
            setTimeout(() => {
              this.isLoading = false;
              this.cdr.detectChanges(); 
            }, 4000);
          }
    
    
        open(login) {
            this.modalService
              .open(login, { ariaLabelledBy: 'modal-basic-title' })
              .result.then(
                (result) => {
                  this.closeResult = `Closed with: ${result}`;
                },
                (reason) => {
                  
                    
                }
              );
    
              this.loadingLogin=true;
          }
        
          private getDismissReason(reason: any): string {
            if (reason === ModalDismissReasons.ESC) {
              return 'by pressing ESC';
            } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
              return 'by clicking on a backdrop';
            } else {
              return `with: ${reason}`;
            }
          }
    
          toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
          }
    
          scrollToSection(sectionId: string) {
            this.router.navigate(['/']);
                this.router.navigate(['/']).then(() => {
                  // Use setTimeout to give Angular some time to complete the navigation
                  setTimeout(() => {
                    const element = document.getElementById(sectionId);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 0);
                });
          }
    
         
    
        ngOnInit(): void {
            this.loadStaticContent();
            this.route.queryParams.subscribe(params => {
                const token = params['token'] || params['Token'];
                if (token) {
                    this.pageLoad = false;
                   // this.checkToken(token);
    
                }
                else {
                    this.pageLoad = true;
                }
                if (params.AppReference && params.ReservationResultIndex) {
                    this.returnUrl = '/search/flight/booking-confirm?AppReference=' + params.AppReference + '&ReservationResultIndex=' + params.ReservationResultIndex;
                } else {
                    this.returnUrl = '/dashboard';
                }
            })
            this.getAirlineHotelPartners();
            this.submitOtp();
            this.createForm();
            this.getDomianInfo();
            this.loadSliderImage();
            this.loadSliderText();
            setTimeout(() => {
                this.loaderb2b = false;
            }, 3000);
        }
    
        sliderUri = baseUrl + '/sa';
        loadSliderImage() {
            let data = { type: "ImageContent","data_source": "b2e"
            }
            this.subSunk.sink = this.authService.getSliderList(data)
                .subscribe(res => {
                    if (res.statusCode == 200) {
                        this.imageData = res.data;
                        this.cdr.detectChanges()
                    }
                }, (err) => {
                    this.errorMessage = err.error.Message;
                });
        }
    
        loadSliderText() {
            let data = { type: "TextContent","data_source": "b2e"}
            this.subSunk.sink = this.authService.getSliderList(data)
                .subscribe(res => {
                    if (res.statusCode == 200) {
                        this.textData = res.data;
                    }
                }, (err) => {
                    this.errorMessage = err.error.Message;
                });
    
        }
    
        getDomianInfo() {
            let title = { page_title: "" }
            this.subSunk.sink = this.authService.getDomainInfo(title)
                .subscribe(res => {
                    if (res.statusCode == 200) {
                        this.domainInfo = res.data[0];
    
                    }
                }, catchError(err => {
                    if (err instanceof HttpErrorResponse) {
    
                        if (err.status == 401) {
    
                        }
                    }
                    return of(err);
                }));
        }
    
        getAirlineHotelPartners12() {
            let title = { page_title: "" }
            this.subSunk.sink = this.authService.getAirline(title)
                .subscribe(res => {
                    if (res.statusCode == 200) {
                        alert('yes')
    
                    }
                }, catchError(err => {
                    if (err instanceof HttpErrorResponse) {
    
                        if (err.status == 401) {
    
                        }
                    }
                    return of(err);
                }));
        }
    
        getAirlineHotelPartners() {
            let title = { page_title: "" }
            this.subSunk.sink = this.apiHandlerService.apiHandler('activeAirlineHotelPartnersList', 'POST', '', '', {})
                .pipe(
                    catchError((error) => {
                        let errorMessage = '';
    
                        if (error.error instanceof ErrorEvent) {
                            errorMessage = `Error: ${error.error.message}`;
    
                        } else {
                            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        }
                        return throwError(error);
                    })
                )
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.hotelPartners = resp.data.filter(el => (el.module_name).toLocaleLowerCase() == 'Hotel'.toLocaleLowerCase());
                        this.airlinePartners = resp.data.filter(el => (el.module_name).toLocaleLowerCase() == 'Flight'.toLocaleLowerCase());
                        this.cdr.detectChanges()
                    }
                }, err => {
                });
        }
    
        getAirlineHotelPartners123() {
            let title = { page_title: "" }
            this.subSunk.sink = this.authService.airlineHotelPartnersList(title)
                .subscribe(res => {
                    if (res.statusCode == 200 || res.statusCode == 201) {
                        this.hotelPartners = res.data.find(el => (el.module_name).toLocaleLowerCase() == 'Hotel'.toLocaleLowerCase());
                        this.airlinePartners = res.data.find(el => (el.module_name).toLocaleLowerCase() == 'Flight'.toLocaleLowerCase());
                        this.cdr.detectChanges()
                    }
                }, (err) => {
                    this.errorMessage = err.error.Message;
                });
        }
    
        createForm(): void {
            if (!this.isDCBLogin) {
                this.loginForm = this.fb.group({
                    email: ['', [Validators.required, Validators.email]], //agent@provab.com
                    password: ['', [Validators.required]], //test@123
                    employeeid: ['', [Validators.required]],
                });
            }
            else {
                this.loginForm = this.fb.group({
                    employeeid: ['', [Validators.required]],
                });
            }
    
        }
    
    
        submitOtp(): void {
            this.VerifyOtpForm = this.fb.group({
                otpinput: ['', [Validators.required]], //agent@provab.com
            });
    
        }
    
        navigateToRegister() {
            this.router.navigate(["auth/register"])
        }
    
        get password() { return this.loginForm.get('password'); }
    
        showDCBLogin() {
            this.isDCBLogin = true;
            this.createForm();
        }
    
        onDCBLogin(t: any) {
            this.errorMessage = '';
            if (!this.loginForm.valid) {
                return;
            }
            this.loading = true;
            this.subSunk.sink = this.authService.onDCBLogin(t.employeeid)
                .subscribe(res => {
                    if (res.statusCode == 201) {
                        this.showOtpComponent = true;
                    } else {
                        this.alertService.error('Invalid Credentials');
                        this.errorMessage = 'Invalid Credentials';
                    }
    
                    this.loading = false;
                }, (err) => {
                    this.errorMessage = err.error.Message;
                    this.loading = false;
    
                });
        }
    
        goBack() {
            this.isDCBLogin = false;
            this.showOtpComponent = false;
            this.createForm();
        }
    
        requestAgain() {
            // this.isDCBLogin=true;
            this.ngOtpInput.setValue(''); // Assuming your component has a method like setValue to set its value
            this.onDCBLogin(this.loginForm.value)
        }
    
        back() {
            this.isDCBLogin = true;
            this.showOtpComponent = false;
        }
    
        onLogin(t: any) {
            if (t.email && t.password && t.employeeid) {
                this.subSunk.sink = this.authService.onLogin(t.employeeid, t.email, t.password)
                    .subscribe(res => {
                        if (res.statusCode == 200) {
                            // this.showOtpComponent = true;
                            this.loadSpinner();
                            this.alertService.success('Login successfull!');
                            setTimeout(() => {
                                this.router.navigateByUrl(this.returnUrl);
                                this.modalService.dismissAll();
                            }, 2500)
                            
                        } else {
    
                        }
                    }, (err) => {
                        this.errorMessage = err.error.Message;
    
                    });
            } else
                this.errorMessage = "Login Id,Username and password are mandatory"
        }
    
        //Hotel Partners brands
        hotelSBrandSlides = [
            { img: 'assets/images/login-images/hotel -01.png' },
            { img: 'assets/images/login-images/hotel -02.png' },
            { img: 'assets/images/login-images/hotel -03.png' },
            { img: 'assets/images/login-images/hotel -04.png' },
            { img: 'assets/images/login-images/hotel -06.png' },
            { img: 'assets/images/login-images/hotel -04.png' }
    
        ];
    
        checkToken(token) {
            let currentUser = {
                access_token: token
            }
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.subSunk.sink = this.apiHandlerService.apiHandler('redirectLogin', 'POST', '', '', {})
                .subscribe(resp => {
                    if (resp.statusCode == 200 || resp.statusCode == 201) {
                        this.authService.setLoginUser(resp.data);
                    }
                    else {
                        this.pageLoad = true;
                    }
                }, err => {
                    this.pageLoad = true;
                    this.authService.logout();
                });
        }
    
        hotelSBrandslideConfig = {
            'slidesToShow': 5, 'slidesToScroll': 5, responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 1008,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
    
            ]
        };
    
        //airline partners brands
        airlineSlides = [
            { img: 'assets/images/login-images/Airline 01.png' },
            { img: 'assets/images/login-images/Airline 02.png' },
            { img: 'assets/images/login-images/Airline 03.png' },
            { img: 'assets/images/login-images/Airline 04.png' },
            { img: 'assets/images/login-images/Airline 05.png' },
            { img: 'assets/images/login-images/Airline 03.png' },
        ]
        airlineSlideConfig = {
            'slidesToShow': 5, 'slidesToScroll': 5, responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 1008,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
    
            ]
        }
    
        //Presence brands
        PresenceSlides = [
            { img: 'assets/images/login-images/Singapore.png', title: 'Singapore' },
            { img: 'assets/images/login-images/INDIA.png', title: 'India' },
            { img: 'assets/images/login-images/bangladesh.png', title: 'Bangladesh' },
            { img: 'assets/images/login-images/Dubai.png', title: 'Dubai' },
            { img: 'assets/images/login-images/Singapore.png', title: 'Singapore' }
        ];
    
        PresenceSlideConfig = {
            'slidesToShow': 4, 'slidesToScroll': 4, responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 1008,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
    
            ]
        };
    
        public openDialog() {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.panelClass = 'dialog-container';
            dialogConfig.width = '500px';
            dialogConfig.height = '250px';
            dialogConfig.autoFocus = true;
            this.dialog
                .open(ForgotPasswordComponent, dialogConfig)
                .afterClosed();
    
                this.modalService.dismissAll();
        }
    
        onOtpChange(otp) {
            this.VerifyOtpForm.patchValue({ otpinput: otp });
        }
    
    
        otpverify(value) {
            if (value.otpinput.length != 6) {
                return;
            }
            this.loading = true;
            this.errorMessage = '';
            let login_id = this.loginForm.get('employeeid').value;
            let otp = value.otpinput;
            this.subSunk.sink = this.authService.validateDCBOTP(login_id, otp)
                .subscribe(res => {
                    if (res.statusCode == 200 || res.statusCode == 201) {
                        // this.showOtpComponent = true;
                        this.alertService.success('Login successfull!');
                        setTimeout(() => {
                            this.router.navigateByUrl(this.returnUrl);
                        }, 250)
                    } else {
                        this.errorMessage = 'Invalid Crentials';
                    }
                    this.loading = false;
                }, (err) => {
                    this.loading = false;
                    this.errorMessage = err.error.Message;
                });
        }

        loadStaticContent() {
            let title = { page_title: "","data_source": "b2e" }
            this.subSunk.sink = this.authService.getStaticContent(title)
                .subscribe(res => {
                    if (res.statusCode == 200) {
                        this.staticContentData = res.data;
                        this.aboutUsData = res.data.find(el => (el.page_title).toLocaleLowerCase() == 'About Us'.toLocaleLowerCase());
                    }
                }, (err) => {
                    this.errorMessage = err.error.Message;
                });
        }
    
        onStaticContent(content) {
            if (this.router.url == "/auth/cms") {
                let title = { page_title: content.page_title, "data_source": "b2e" }
                this.authService.getStaticContent(title).subscribe(res => {
                    if (res.statusCode == 200) {
                        sessionStorage.setItem('static_title', content.page_title);
                        let contentDesc = res.data.filter((ele) => ele.page_title === content.page_title);
                        this.authService.reloadCurrentRoute();
                        this.changeContent.emit(contentDesc);
                    }
                }, (err) => {
                });
            } else {
                sessionStorage.setItem('static_title', content.page_title);
                const url = this.router.serializeUrl(
                    this.router.createUrlTree(['auth/cms'])
                );
               window.open(url, '_blank');
            }
        }

         redirectRegistration(){
        this.modalService.dismissAll();
        this.router.navigate(['/auth/register']);
    }
    
        ngOnDestroy(): void {
            this.subSunk.unsubscribe();
        }

}
