import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { B2bComponent } from './CORPORATE/corporate/b2b.component';
import { CorporateFlightComponent } from './CORPORATE/corporate/corporate-flight/corporate-flight.component';
import { CorporateHotelComponent } from './CORPORATE/corporate/corporate-hotel/corporate-hotel.component';
import { AuthGuard } from '../../auth/auth.guard';
import { FlightVoucherComponent, CarVoucherComponent, HotelVoucherComponent, CorporateCarComponent } from './CORPORATE/index'
import { FlightInvoiceComponent } from './CORPORATE/corporate/voucher/flight-invoice/flight-invoice.component';
import { HotelInvoiceComponent } from './CORPORATE/corporate/voucher/hotel-invoice/hotel-invoice.component';
import { UpdatePnrTicketComponent } from './components/update-pnr-ticket/update-pnr-ticket.component';
import { CorporateBusComponent } from './CORPORATE/corporate/corporate-bus/corporate-bus.component';
import { CorporateTrainComponent } from './CORPORATE/corporate/corporate-train/corporate-train.component';
import { BusVoucherComponent } from './CORPORATE/corporate/voucher/bus-voucher/bus-voucher.component';
import { BusInvoiceComponent } from './CORPORATE/corporate/voucher/bus-invoice/bus-invoice.component';
import { TrainInvoiceComponent } from './CORPORATE/corporate/voucher/train-invoice/train-invoice.component';
import { TrainVoucherComponent } from './CORPORATE/corporate/voucher/train-voucher/train-voucher.component';
import { CarInvoiceComponent } from './CORPORATE/corporate/voucher/car-invoice/car-invoice.component';
import { HotelViewComponent } from './CORPORATE/corporate/corporate-hotel/hotel-view/hotel-view.component';
import { TrainViewComponent } from './CORPORATE/corporate/corporate-train/train-view/train-view.component';
import { CarViewComponent } from './CORPORATE/corporate/corporate-car/car-view/car-view.component';
import { FinanceFlightComponent } from './CORPORATE/corporate/finace-flight/finance-flight.component';
import { FinanceHotelComponent } from './CORPORATE/corporate/finance-hotel/finance-hotel.component';


const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'b2b',
        canActivate: [AuthGuard],
        component: B2bComponent,
        data: {extraParameter: 'reportsMenus'}
      },
      {
        path: 'flight',
        canActivate: [AuthGuard],
        component: CorporateFlightComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
       {
        path: 'finance-flight',
        canActivate: [AuthGuard],
        component: FinanceFlightComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
         {
        path: 'finance-hotel',
        canActivate: [AuthGuard],
        component: FinanceHotelComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'hotel',
        canActivate: [AuthGuard],
        component: CorporateHotelComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'bus',
        component: CorporateBusComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'car',
        component: CorporateCarComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'train',
        component: CorporateTrainComponent,
        data: {extraParameter: 'b2b-reports-Menus'}
      },
      {
        path: 'voucher/flight',
        component: FlightVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'voucher/bus',
        component: BusVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'voucher/hotel',
        component: HotelVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'voucher/car',
        component: CarVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'voucher/train',
        component: TrainVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'invoice/flight',
        component: FlightInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'invoice/bus',
        component: BusInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'invoice/hotel',
        component: HotelInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'invoice/car',
        component: CarInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'invoice/train',
        component: TrainInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'flight/update-pnr',
        component: UpdatePnrTicketComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'hotel-view',
        component: HotelViewComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'train-view',
        component: TrainViewComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'car-view',
        component: CarViewComponent,
        data: {extraParameter: ''}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
