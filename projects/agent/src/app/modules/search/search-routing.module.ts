import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { BookingComponent } from './flight/booking/booking.component';
import { RoundTripComponent } from './flight/result/round-trip/round-trip.component';
import { 
    FlightComponent,
    ResultComponent,
    ConfirmPassengerComponent,
    SearhFormComponent,
    BookingConfirmComponent,
    HotelComponent,
    HotelResultComponent,
    HotelBookingComponent,
    HotelGuestDetailsComponent,
    HotelConfirmationComponent,
    HotelPaymentDetailComponent,
    HotelVoucherComponent,
    HotelProceedPaymentComponent,
    BusResultComponent,
    BusBookingComponent,
    BusPaymentComponent,
    BusConfirmationComponent,
    BusVoucherComponent
 } from './index';
import { FlightConfirmationComponent } from './flight/booking/flight-confirmation/flight-confirmation.component';
import { BookingFailedComponent } from './booking-failed/booking-failed.component';
import { BusBookingConfirmationComponent } from './bus/bus-booking-confirmation/bus-booking-confirmation.component';

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'search-form',
                component: SearhFormComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight',
                component: FlightComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/result',
                component: ResultComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/round-trip',
                component: RoundTripComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/booking',
                component: BookingComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'flight/confirm-passenger',
                component: ConfirmPassengerComponent,
                data: { extraParameter: 'searchMenus' }
            },

            {
                path: 'flight/confirmation',
                component: FlightConfirmationComponent,
                data: { extraParameter: 'searchMenus' }
            },

            {
                path: 'flight/booking-confirm',
                component: BookingConfirmComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel',
                component: HotelComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/result',
                component: HotelResultComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/booking',
                component: HotelBookingComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/guests',
                component: HotelGuestDetailsComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'hotel/payment',
                component: HotelPaymentDetailComponent,
            },
            {
                path: 'hotel/proceed-payment',
                component: HotelProceedPaymentComponent,
            },
            {
                path: 'hotel/confirmation',
                component: HotelConfirmationComponent,
            },
            {
                path: 'hotel/voucher',
                component: HotelVoucherComponent,
                data: { extraParameter: 'searchMenus' }
            },
            {
                path: 'bus/result',
                component: BusResultComponent,
                data: { extraParameter: 'searchMenus' }
            },
           
            {
                path: 'bus/bus-booking',
                component: BusBookingComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'bus/bus-payment',
                component: BusPaymentComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'bus/bus-confirmation',
                component: BusConfirmationComponent,
                data: { extraParameters: '' }
            },
            {
                path:'bus/bus-booking-confirmation',
                component:BusBookingConfirmationComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'bus/bus-voucher',
                component: BusVoucherComponent,
                data: { extraParameters: '' }
            },

            {
                path: 'search/booking-failed',
                component: BookingFailedComponent,
                data: { extraParameters: '' }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SearchRoutingModule { }
