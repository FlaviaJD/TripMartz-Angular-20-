import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RecoveryPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    NgBootstrapFormValidationModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    LoginComponent,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }
