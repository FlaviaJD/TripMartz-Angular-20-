
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'header',
        loadChildren: () => import('./modules/header/header.module').then(m => m.HeaderModule)
    },
    {
        path: 'b2creward',
        loadChildren: () => import('./modules/rewards-b2c/rewards-b2c.module').then(m => m.RewardsB2cModule)
    },
    {
        path: 'supplier',
        loadChildren: () => import('./modules/supplier-management/supplier-management.module').then(m => m.SupplierManagementModule)
    },
    {
        path: 'manage',
        loadChildren: () => import('./modules/manage-country-state-city/manage-country-state-city.module').then(m => m.ManageCountryStateCityModule,
        )
    },
    {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule,
        )
    },
    {
        path: 'report',
        loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule,
        )
    },
    {
        path: 'cms',
        loadChildren: () => import('./modules/cms/cms.module').then(m => m.CmsModule,
        )
    },
    {
        path: 'master',
        loadChildren: () => import('./modules/master/master.module').then(m => m.MasterModule,
        )
    },

    {
        path: 'icic-hotel-master',
        loadChildren: () => import('./modules/icic-hotel-master/icic-hotel-master.module').then(m => m.IcicHotelMasterModule,
        )
    },

    {
        path: 'training',
        loadChildren: () => import('./modules/training/training.module').then(m => m.TrainingModule,
        )
    },
    {
        path: "users",
        loadChildren: () =>
          import("./modules/users/users.module").then((m) => m.UsersModule),
      },
    {
        path: 'payment',
        loadChildren: () =>import('./modules/payment/payment.module').then(m=>m.PaymentModule
        )
    },
    {
        path: 'bank',
        loadChildren: () =>import('./modules/bank-account-details/bank-account-details.module').then(m=>m.BankAccountDetailsModule
        )
    },
    {
        path: 'mis-downloads',
        loadChildren: () =>import('./modules/mis-downloads/mis-downloads.module').then(m=>m.MISDownloadsModule
        )
    },

    {
        path:'billing',
        loadChildren:()=>import('./modules/billing/billing.module').then(m=>m.BillingModule)
    },
    {
        path:'property',
        loadChildren:()=>import('./modules/property-crs/property-crs.module').then(m=>m.PropertyModule)
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
               // useHash: false,
            })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

