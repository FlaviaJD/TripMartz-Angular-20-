import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHandlerService } from '../../../core/api-handlers';
import { AuthService } from '../../auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { SwalService } from '../../../core/services/swal.service';

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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  slideConfig2 = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '0',
    slidesToShow: 1,
    speed: 500,
    dots: true,
  };
  loadinglogo: boolean = true;
  loading = false;
  submitted = false;
  returnUrl: string;
  loginForm: FormGroup;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  errorMessage = '';
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiHandlerService: ApiHandlerService,
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private swalService: SwalService
  ) {
    let currentURL = window.location.href; 
    if (localStorage.getItem('currentSupervisionUser')) 
    {
         this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loginForm = this.fb.group({
      user_id:['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3)]],
      password: ['', Validators.required]
    });
    setTimeout(()=>{                           // <<<---using ()=> syntax
        this.loadinglogo = false;
    }, 7000);
  }

 

  loadSpinner() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges(); 
    }, 4000);
  }


  
  get f() { return this.loginForm.controls; }

  onLogin() {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.onLogin(this.loginForm.get('user_id').value,this.loginForm.get('email').value, this.loginForm.get('password').value)
      .subscribe(res => {
        if (res['statusCode'] == 200 && res['data']['access_token'] != undefined) {
          this.router.navigate([this.returnUrl]);
          this.loadSpinner();
          this.swalService.alert.success("Login Successful.")
        } else {
          this.errorMessage = res.Message;
          this.swalService.alert.oops(this.errorMessage)
        }
        this.loading = false;
        
      }, (err) => {
        this.errorMessage = (err.status == 403 || 401) ? 'Invalid Credentials' : err.error.Message;
      });
  }

}
