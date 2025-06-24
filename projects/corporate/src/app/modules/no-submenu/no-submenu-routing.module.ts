import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountDetailsComponent } from './components/bank-account-details/bank-account-details.component';
import { SeoComponent } from './components/seo/seo.component';
import { EditComponent } from './components/seo/edit/edit.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { EmployeeCallbackSupportComponent, TransactionLogsComponent, LogComponent  } from './components';
import { FlightComponent, HotelComponent, CarComponent} from  './components';
import { AuthGuard } from '../../auth/auth.guard';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { SupportDocumentsComponent } from './components';
import { SendLatestNewsComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'bank-account-details',
        component: BankAccountDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'seo',
        component: SeoComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'seo-edit',
        component: EditComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'employeeCallBackSupport',
        canActivate: [AuthGuard],
        component: EmployeeCallbackSupportComponent,
        data: {extraParameter: 'employee-CallBack-Support'}
      },
      {
        path: 'transaction-logs',
        canActivate: [AuthGuard],
        component: TransactionLogsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/log',
        component: LogComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/voucher/flight',
        component: FlightComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/voucher/hotel',
        component: HotelComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'transaction-logs/voucher/car',
        component: CarComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'update-credit',
        component: CreditLimitComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'support-documents',
        component: SupportDocumentsComponent,
        data: {extraParameter: 'supportDocumentsMenus'}
      },
      {
        path: 'send-latest-news',
        component: SendLatestNewsComponent,
        data: {extraParameter: 'sendLatestNewsMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoSubmenuRoutingModule { }
