import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    StaticContentComponent,
    ResetPasswordComponent
} from './components';
import { AuthRoutingModule } from './auth-routing.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { LayoutsModule } from '../layout/layout.module';
import { ActivateComponent } from './components/activate/activate.component';
import { CoreModule } from '../core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HomePageHeaderComponent } from "./components/home-page-header/home-page-header.component";
import { HomePageFooterComponent } from './components/home-page-footer/home-page-footer.component';
import { PolicyApprovalComponent } from './components/policy-approval/policy-approval.component';
// import { NgOtpInputModule } from 'ng-otp-input';
import { PolicyConfirmationComponent } from './components/policy-confirmation/policy-confirmation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackConfirmationComponent } from './components/feedback-confirmation/feedback-confirmation.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ActivateComponent,
    StaticContentComponent,
    HomePageHeaderComponent,
    HomePageFooterComponent,
    ResetPasswordComponent,
    PolicyApprovalComponent,
    PolicyConfirmationComponent,
    FeedbackComponent,
    FeedbackConfirmationComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    NgBootstrapFormValidationModule,
    LayoutsModule,
    CarouselModule,
    //NgOtpInputModule,
    NgbModule
  ]
})
export class AuthModule { }
