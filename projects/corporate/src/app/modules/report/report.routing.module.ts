import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
// import { B2bComponent } from './booking/b2b/b2b.component';
import { BookingFlightComponent } from './booking/booking-flight/booking-flight.component';
import { BookingHotelComponent } from './booking/booking-hotel/booking-hotel.component';
import { AuthGuard } from '../../auth/auth.guard';
import { FlightComponent, CarComponent, HotelComponent, BookingCarComponent, 
        TrainComponent,BusComponent } from './booking/index'
import { BookingFlightInvoiceComponent } from './booking/voucher/booking-flight-invoice/booking-flight-invoice.component';
import { BookingHotelInvoiceComponent } from './booking/voucher/booking-hotel-invoice/booking-hotel-invoice.component';
import { BookingTrainComponent } from './booking/booking-train/booking-train.component';
import { BookingBusComponent } from './booking/booking-bus/booking-bus.component';
import { BookingTrainInvoiceComponent } from './booking/voucher/booking-train-invoice/booking-train-invoice.component';
import { BookingBusInvoiceComponent } from './booking/voucher/booking-bus-invoice/booking-bus-invoice.component';
import { BookingCarInvoiceComponent } from './booking/voucher/booking-car-invoice/booking-car-invoice.component';
import { BookingBusVoucherComponent } from './booking/voucher/booking-bus-voucher/booking-bus-voucher.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
    //   {
    //     path: 'booking',
    //     canActivate: [AuthGuard],
    //     component: B2bComponent,
    //     data: {extraParameter: 'reportsMenus'}
    //   },
      {
        path: 'booking-flight',
        canActivate: [AuthGuard],
        component: BookingFlightComponent,
        data: {extraParameter: 'booking-reports-Menus'}
      },
      {
        path: 'booking-hotel',
        canActivate: [AuthGuard],
        component: BookingHotelComponent,
        data: {extraParameter: 'booking-reports-Menus'}
      },
      {
        path: 'booking-car',
        component: BookingCarComponent,
        data: {extraParameter: 'booking-reports-Menus'}
      },
      {
        path: 'booking/voucher/flight',
        component: FlightComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking/voucher/hotel',
        component: HotelComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking/voucher/car',
        component: CarComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking-car/invoice',
        component: BookingCarInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking-flight/invoice',
        component: BookingFlightInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking-hotel/invoice',
        component: BookingHotelInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking-train',
        canActivate: [AuthGuard],
        component: BookingTrainComponent,
        data: {extraParameter: 'booking-reports-Menus'}
      },
      {
        path: 'booking-train/invoice',
        component: BookingTrainInvoiceComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking/voucher/train',
        component: TrainComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking/voucher/bus',
        component: BookingBusVoucherComponent,
        data: {extraParameter: ''}
      },
      {
        path: 'booking-bus',
        canActivate: [AuthGuard],
        component: BookingBusComponent,
        data: {extraParameter: 'booking-reports-Menus'}
      },
      {
        path: 'booking-bus/invoice',
        component: BookingBusInvoiceComponent,
        data: {extraParameter: ''}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
