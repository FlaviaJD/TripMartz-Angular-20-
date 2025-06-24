import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesLayoutComponent } from '../layout/pages-layout/pages-layout.component';
import { LoginComponent, RegisterComponent, ForgotPasswordComponent, StaticContentComponent, ResetPasswordComponent } from './components';
import { ActivateComponent } from './components/activate/activate.component';
import { PolicyApprovalComponent } from './components/policy-approval/policy-approval.component';
import { PolicyConfirmationComponent } from './components/policy-confirmation/policy-confirmation.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackConfirmationComponent } from './components/feedback-confirmation/feedback-confirmation.component';

const routes: Routes = [
    {
        path: '',
        component: PagesLayoutComponent,
        children: [
            { path: '', component: LoginComponent, data: { extraParameter: '' } },
            { path: 'login', component: LoginComponent, data: { extraParameter: '' } },
            { path: 'register', component: RegisterComponent, data: { extraParameter: '' } },
            { path: 'forgotPassword', component: ForgotPasswordComponent, data: { extraParameter: '' } },
            { path: 'activate', component: ActivateComponent, data: { extraParameter: '' } },
            { path: 'cms', component: StaticContentComponent, data: { extraParameter: '' } },
            { path: 'reset-password', component: ResetPasswordComponent, data: { extraParameter: '' } },
            { path: 'policy-approval', component: PolicyApprovalComponent, data: { extraParameter: '' } },
            { path: 'policy-confirmation', component: PolicyConfirmationComponent, data: { extraParameter: '' } },
            { path: 'feedback', component: FeedbackComponent, data: { extraParameter: '' } },
            { path: 'feedback-confirmation', component: FeedbackConfirmationComponent, data: { extraParameter: '' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}