import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountDetailsComponent } from './components/bank-account-details/bank-account-details.component';
import { SeoComponent } from './components/seo/seo.component';
import { EditComponent } from './components/seo/edit/edit.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AgentCallbackSupportComponent, TransactionLogsComponent, LogComponent, AgentBalanceComponent  } from './components';
import { FlightComponent, HotelComponent, CarComponent} from  './components';
import { AuthGuard } from '../../auth/auth.guard';
import { ImportPnrComponent } from './components/import-pnr/import-pnr.component';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { GstDetailsComponent } from './components/gst-details/gst-details.component';
import { HotelQueuesDetailsComponent } from './components/hotel-queues-details/hotel-queues-details.component';
import { TrainQueueDetailsComponent } from './components/train-queue-details/train-queue-details.component';
import { CabDetailsComponent } from './components/cab-details/cab-details.component';
import { IciciHotelQueuesDetailsComponent } from './components/icici-hotel-queues-details/icici-hotel-queues-details.component';
import { CancellationHotelQueuesDetailsComponent } from './components/cancellation-hotel-queues-details/cancellation-hotel-queues-details.component';
import { CancellationTrainQueuesDetailsComponent } from './components/cancellation-train-queues-details/cancellation-train-queues-details.component';
import { CancellationCabQueuesDetailsComponent } from './components/cancellation-cab-queues-details/cancellation-cab-queues-details.component';
import { IcicHotelDetailsComponent } from './components/icici-hotel-queues-details/icic-hotel-details/icic-hotel-details.component';
import { TrainRequestComponent } from './components/train-queue-details/train-request/train-request.component';
import { TrainCancelRequestComponent } from './components/cancellation-train-queues-details/train-cancel-request/train-cancel-request.component';
import { HotelCancelRequestComponent } from './components/cancellation-hotel-queues-details/cancellation-hotel-queues/hotel-cancel-request/hotel-cancel-request.component';
import { CorporateCodeComponent } from './components/corporate-code/corporate-code.component';
import { AirlineGstComponent } from './components/airline-gst/airline-gst.component';
import { DcbHotelDetailsComponent } from './components/hotel-queues-details/dcb-hotel-details/dcb-hotel-details.component';
import { CabRequestComponent } from './components/cab-details/cab-queues/cab-request/cab-request.component';
import { CabCancellationRequestComponent } from './components/cancellation-cab-queues-details/cab-cancellation-request/cab-cancellation-request.component';
import { FinanceGstDetailsComponent } from './components/gst-details/finance-gst-details.component';
import { FinanceAirlineGstComponent } from './components/finance-airline-gst/finance-airline-gst.component';

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
        path: 'agentCallBackSupport',
        canActivate: [AuthGuard],
        component: AgentCallbackSupportComponent,
        data: {extraParameter: 'agent-CallBack-Support'}
      },
      {
        path: 'agent-balance',
        canActivate: [AuthGuard],
        component: AgentBalanceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'gst-details',
        canActivate: [AuthGuard],
        component: GstDetailsComponent,
        data: {extraParameter: ''}
      },
       {
        path: 'finance-gst-details',
        canActivate: [AuthGuard],
        component: FinanceGstDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'airline-gst',
        canActivate: [AuthGuard],
        component: AirlineGstComponent,
        data: {extraParameter: ''}
      },
       {
        path: 'finance-airline-gst',
        canActivate: [AuthGuard],
        component: FinanceAirlineGstComponent,
        data: {extraParameter: ''}
      },

      {
        path: 'hotel-queues',
        canActivate: [AuthGuard],
        component: HotelQueuesDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'icici-hotel-queues',
        canActivate: [AuthGuard],
        component: IciciHotelQueuesDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cancellation-hotel-queues',
        canActivate: [AuthGuard],
        component: CancellationHotelQueuesDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cancellation-train-queues',
        canActivate: [AuthGuard],
        component: CancellationTrainQueuesDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cancellation-cab-queues',
        canActivate: [AuthGuard],
        component: CancellationCabQueuesDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'general-train-queues',
        canActivate: [AuthGuard],
        component: TrainQueueDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'tatkal-one-train-queues',
        canActivate: [AuthGuard],
        component: TrainQueueDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'tatkal-two-train-queues',
        canActivate: [AuthGuard],
        component: TrainQueueDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cab-queues',
        canActivate: [AuthGuard],
        component: CabDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cab-queues/cab-request',
        canActivate: [AuthGuard],
        component: CabRequestComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'train-queues/train-request',
       // canActivate: [AuthGuard],
        component: TrainRequestComponent,
        data: {extraParameter: ''}
      },

      {
        path: 'cancellation-train-queues/cancel-request',
        //canActivate: [AuthGuard],
        component: TrainCancelRequestComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cancellation-cab-queues/cancel-request',
        // canActivate: [AuthGuard],
        component: CabCancellationRequestComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'import-pnr',
        canActivate: [AuthGuard],
        component: ImportPnrComponent,
        data: {extraParameter: ''}
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
        path: 'icic-hotel-details',
        component: IcicHotelDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'dcb-hotel-details',
        component: DcbHotelDetailsComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'cancellation-hotel-queues/cancel-request',
        component: HotelCancelRequestComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'corporate-code',
        component: CorporateCodeComponent,
        data: {extraParameter: ''}
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoSubmenuRoutingModule { }
