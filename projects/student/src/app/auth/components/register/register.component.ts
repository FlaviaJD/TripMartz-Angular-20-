import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { SubSink } from 'subsink';
import { AlertService } from '../../../core/services/alert.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SwalService } from '../../../core/services/swal.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
    public registerImage: any = "assets/images/register-banner.png";
    slideConfig2 = {
        className: 'center',
        centerMode: true,
        infinite: true,
        centerPadding: '0',
        slidesToShow: 1,
        speed: 500,
        dots: false,
    };
    data = [];
    staticCountries = [
        {
            name: 'India',
            code: 'india'
        }
    ]
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    countries: any = [];
    errorMessage = '';
    hide: boolean = false;
    get email() { return this.registerForm.get('email'); }
    protected subs = new SubSink();

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private dialog: MatDialog,
        private swalService: SwalService,
    ) {
        if (localStorage.getItem('studentCurrentUser')) {
            this.router.navigate(['/dashboard']);
        }
    }

    ngOnInit() {
        this.subs.sink = this.apiHandlerService.apiHandler('countryList', 'post', '', '').subscribe(res => {
            this.staticCountries = res.data.popular_countries.concat(res.data.countries);
        });
        this.createForm();
    }
    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    getCountries() {
        this.apiHandlerService.apiHandler('CountryList', 'POST', '', '', {})
            .subscribe(res => {
                if (res.data) {
                    this.staticCountries = res.data.popular_countries.concat(res.data.countries);
                } else {
                    this.errorMessage = res.data.msg;
                }
            });

    }
    omitSpecialCharacters(event) {
        let k = event.charCode;
        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32);
    }


    createForm() {
        this.registerForm = this.fb.group({
            first_name: ['', [Validators.required,Validators.minLength(3)]],
            last_name: ['', [Validators.required]],
            business_name: ['', [Validators.required]],
            business_number: [''],
            country: ['', [Validators.required]],
            phone: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            confirmCheckbox: ['', [Validators.requiredTrue]]
        });
    }
    onRegister(t: any) {
        if (t.invalid) {
            return;
        } else {
            const formdata = {
                first_name: this.registerForm.controls['first_name'].value,
                last_name: this.registerForm.controls['last_name'].value,
                email: this.registerForm.controls['email'].value,
                business_name: this.registerForm.controls['business_name'].value,
                password: this.registerForm.controls['password'].value,
                business_phone: this.registerForm.controls['business_number'].value,
                country: this.registerForm.controls['country'].value,
                phone: this.registerForm.controls['phone'].value,
            }
            const formdata1 = JSON.stringify(formdata)
            
            this.subs.sink = this.apiHandlerService.apiHandler('registration', 'POST', '', '', { ...formdata })
                .subscribe(res => {

                    if (res.Status == true) {
                        this.swalService.alert.success('Registration successfull!!, Please verify link, sent to your registred email');
                        setTimeout(() => {
                            this.router.navigate(['/auth/login']);
                        }, 1000)

                    } else {
                        this.hide = true;
                        this.errorMessage = res.data.msg;
                        this.swalService.alert.oops(res.Message);
                    }
                }, (errorResponse) => {
                    this.hide = true;
                    if (errorResponse.error.Message == "403 Already exists") {
                        this.swalService.alert.oops("Email Already Exists.");
                    }else{
                        this.swalService.alert.oops(errorResponse.error.msg);
                    }
                });
        }
    }

    public openDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'dialog-container';
        dialogConfig.width = '354px';
        dialogConfig.height = '203px';
        dialogConfig.autoFocus = true;
        this.dialog
            .open(ForgotPasswordComponent, dialogConfig)
            .afterClosed()
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
