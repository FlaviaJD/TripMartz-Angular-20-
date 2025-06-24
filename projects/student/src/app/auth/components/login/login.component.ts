import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild,NgZone, EventEmitter} from '@angular/core';
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
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

const baseUrl = environment.SA_URL;

const loginPopup: NavigationExtras = {
    state: {
        status: true
    }
};

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
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

    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        center: false,
        dots: false,
        autoHeight: true,
        autoWidth: true,
        margin: 15,
        responsive: {
          0: {
            items: 2,
          },
          600: {
            items: 3,
          },
          1000: {
            items: 5,
          }
        }
      }
      
    @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;
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
        if (localStorage.getItem('studentCurrentUser')) {
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
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

     

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'] || params['Token'];
            if (token) {
                this.pageLoad = false;

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
        this.getDomianInfo();
        this.loadSliderImage();
        this.loadSliderText();
        setTimeout(() => {
            this.loaderb2b = false;
        }, 3000);
    }

    sliderUri = baseUrl + '/sa';
    loadSliderImage() {
        let data = { type: "ImageContent" }
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
        let data = { type: "TextContent" }
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

    //Hotel Partners brands
    hotelSBrandSlides = [
        { img: 'assets/images/login-images/hotel -01.png' },
        { img: 'assets/images/login-images/hotel -02.png' },
        { img: 'assets/images/login-images/hotel -03.png' },
        { img: 'assets/images/login-images/hotel -04.png' },
        { img: 'assets/images/login-images/hotel -06.png' },
        { img: 'assets/images/login-images/hotel -04.png' }

    ];

   

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

   
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}