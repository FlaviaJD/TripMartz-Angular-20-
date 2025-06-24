
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'header',
        loadChildren: () => import('./modules/header/header.module').then(m => m.HeaderModule)
    },
 
    {
        path: 'masterbalance',
        loadChildren: () => import('./modules/master-balance/master-balance.module').then(m => m.MasterBalanceModule)
    },
    {
        path: 'account',
        loadChildren: () => import('./modules/account-manager/account-manager.module').then(m => m.AccountManagerModule)
    },
    {
        path: 'agent-account',
        loadChildren: () => import('./modules/agent-account-manager/agent-account-manager.module').then(m => m.AgentAccountManagerModule)
    },
    {
        path: 'bank',
        loadChildren: () => import('./modules/bank-account-details/bank-account-details.module').then(m => m.BankAccountDetailsModule)
    },
    {
        path: 'supplier',
        loadChildren: () => import('./modules/supplier-management/supplier-management.module').then(m => m.SupplierManagementModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule,
        )
    },
    {
        path: 'user',
        loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule,
        )
    },
    {
        path: 'report',
        loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule,
        )
    },
    {
        path: 'mis-download',
        loadChildren: () =>import('./modules/mis-download/mis-download.module').then(m=>m.MISDownloadModule
        )
    },
    {
        path: 'master',
        loadChildren: () =>import('./modules/master/master.module').then(m=>m.MasterModule
        )
    },
    {
        path: 'cms',
        loadChildren: () => import('./modules/cms/cms.module').then(m => m.CmsModule,
        )
    },
    {
        path: 'commissions',
        loadChildren: () => import('./modules/commissions/commissions.module').then(m => m.CommissionsModule,
        )
    },
    {
        path: '**', redirectTo: ''
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,

            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: "ignore",
                //useHash: false,
            })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
