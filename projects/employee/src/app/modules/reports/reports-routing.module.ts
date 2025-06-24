import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import {
    TransactionLogsComponent,
    AccountLedgerComponent,
    PNRSearchComponent,
    DailySalesReportComponent,
    PendingTicketComponent,
    FlightBookingReportComponent,
    HotelBookingReportComponent,
    CarBookingReportComponent
} from './components';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../auth/auth.guard';
import { VoucherComponent } from './components/booking-details/voucher/voucher.component';
import { HotelVoucherComponent } from './components/booking-details/hotel-voucher/hotel-voucher.component';
import { UpdatePnrTicketComponent } from './components/flight-booking-report/components/update-pnr-ticket/update-pnr-ticket.component';
import { FlightTrackerComponent } from './components/account-ledger/components/flight-tracker/flight-tracker.component';
import { MapCheckComponent } from "./components/map-check/map-check.component";
import { TrainBookingReportComponent } from "./components/train-booking-report/train-booking-report.component";
import { TrainTicketComponent } from "./components/train-booking-report/components/train-ticket/train-ticket.component";
import { CarTicketComponent } from "./components/car-booking-report/components/car-ticket/car-ticket.component";
import { IciciHotelBookingReportComponent } from "./components/icici-hotel-booking-report/icici-hotel-booking-report.component";
import { HotelInvoiceComponent } from "./components/booking-details/hotel-invoice/hotel-invoice.component";
import { TrainInvoiceComponent } from "./components/train-booking-report/components/train-invoice/train-invoice.component";
import { CarInvoiceComponent } from "./components/car-booking-report/components/car-invoice/car-invoice.component";
import { BusBookingReportComponent } from "./components/bus-booking-report/bus-booking-report.component";

const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'flight-booking-details',
                component: FlightBookingReportComponent,
                data: {extraParameter: 'reportsMenus'}
            },
            {
                path: 'hotel-booking-details',
                component: HotelBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'train-booking-details',
                component: TrainBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'bus-booking-details',
                component: BusBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'car-booking-details',
                component: CarBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'car-voucher',
                component: CarTicketComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'car-invoice',
                component: CarInvoiceComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'icici-hotel-booking-details',
                component: IciciHotelBookingReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'transaction-logs',
                component: TransactionLogsComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'pnr-search',
                component: PNRSearchComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'daily-sales',
                component: DailySalesReportComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'account-ledger',
                component: AccountLedgerComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'pending-ticket',
                component: PendingTicketComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'flight-voucher',
                component: VoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'hotel-voucher',
                component: HotelVoucherComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'hotel-invoice',
                component: HotelInvoiceComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'train-voucher',
                component: TrainTicketComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'train-invoice',
                component: TrainInvoiceComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'flight-update-pnr',
                component: UpdatePnrTicketComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'flight-tracker',
                component: FlightTrackerComponent,
                data: { extraParameter: 'reportsMenus' }
            },
            {
                path: 'map',
                component: MapCheckComponent,
                data: { extraParameter: 'reportsMenus' }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRouterModule { }