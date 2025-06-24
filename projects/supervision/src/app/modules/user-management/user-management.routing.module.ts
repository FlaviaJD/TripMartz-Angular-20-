
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { SubAdminActiveComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active.component';
import { CreateSubAdminComponent } from './manage-subAdmin/subAdmin-active/create-sub-admin/create-sub-admin.component';
import { SubAdminActiveListComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active-list/sub-admin-active-list.component';
import { AdminProfileComponent } from './users/admin-profile/admin-profile.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { CorporateActiveComponent } from './manage-corporate/corporate/manageCorporate/corporate-active/corporate-active.component';
import { ManageActiveCreateCorporateComponent } from './manage-corporate/corporate/manageCorporate/corporate-active/manage-active-create-corporate/manage-active-create-corporate.component';
import { CorporateActiveListComponent } from './manage-corporate/corporate/manageCorporate/corporate-active/corporate-active-list/corporate-active-list.component';
import { AgentActiveComponent } from './manage-agent/agent-active/agent-active.component';
import { FinanceListComponent } from './manage-finance/finance-list/finance-list.component';
import { ManageFinanceComponent } from './manage-finance/manage-finance-active/manage-finance.component';

const routes: Routes = [
{
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
        {
            path: 'manage-agent/active',
            canActivate: [AuthGuard],
            component: AgentActiveComponent,
            data: { extraParameter: 'ManageAgentMenus' }
        },

        {
            path: 'manage-agent/in-active',
            canActivate: [AuthGuard],
            component: AgentActiveComponent,
            data: { extraParameter: 'ManageAgentMenus' }
        },

        {
            path: 'manage-corporate/active',
            canActivate: [AuthGuard],
            component: CorporateActiveComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },

        {
            path: 'manage-corporate/in-active',
            canActivate: [AuthGuard],
            component: CorporateActiveComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },
        {
            path: 'manage-corporate/active/create-b2b',
            canActivate: [AuthGuard],
            component: ManageActiveCreateCorporateComponent,
            data: { extraParameter: 'ManageAgentB2BMenus' }
        },

        {
            path: 'manage-finance/list',
            canActivate: [AuthGuard],
            component: ManageFinanceComponent,
            data: { extraParameter: 'ManageFinanceB2BMenus' }
        },
        {
            path: 'manage-finance/list/in-active',
            canActivate: [AuthGuard],
            component: ManageFinanceComponent,
            data: { extraParameter: 'ManageFinanceB2BMenus' }
        },
        

        // {
        //     path: 'b2b/active/list',
        //     canActivate: [AuthGuard],
        //     component: CorporateActiveListComponent,
        //     data: { extraParameter: 'ManageAgentB2BMenus' }
        // },
        {
            path: 'subAdmin/active',
            canActivate: [AuthGuard],
            component: SubAdminActiveComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'subAdmin/in-active',
            canActivate: [AuthGuard],
            component: SubAdminActiveComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'subAdmin/active/create/subAdmin',
            canActivate: [AuthGuard],
            component: CreateSubAdminComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'subAdmin/active/list',
            canActivate: [AuthGuard],
            component: SubAdminActiveListComponent,
            data: { extraParameter: 'ManageSubAdminMenus' }
        },
        {
            path: 'admin-profile',
            component: AdminProfileComponent,
            data: { extraParameter: '' }
        },
        {
            path: 'change-password',
            component: ChangePasswordComponent,
            data: { extraParameter: '' }
        },
        {
            path: 'privileges',
            component: PrivilegesComponent,
            data: { extraParameter: '' }
        }
    ]
}
 
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}