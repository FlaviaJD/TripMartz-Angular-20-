import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesLayoutComponent } from '../layout/pages-layout/pages-layout.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';
const routes: Routes = [
    {
        path: 'auth',
        component: PagesLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent, data: { extraParameter: '' } },
            { path: 'forgot-password', component: ForgotPasswordComponent, data: { extraParameter: '' } },
            { path: 'recovery-password', component: RecoveryPasswordComponent, data: { extraParameter: '' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule {
}