import { NgModule } from "@angular/core";
import {
    AgentsComponent,
    TransactionLogsComponent,
    SearchHistoryComponent,
    TopDestinationsComponent,
    AccountLedgerComponent,
    DynamicTableComponent,
    AdvSearchComponent,
    BookingDetailsComponent,
    DailySalesReportComponent,
    PendingTicketComponent,
    PNRSearchComponent,
} from './components';
import { ReportsRouterModule } from './reports-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';
import { LayoutsModule } from '../../layout/layout.module';
import { VoucherComponent } from './components/booking-details/voucher/voucher.component';
import { SearchComponent } from './components/search/search.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SearchFormComponent } from './components/search/components/search-form/search-form.component';
import { FlightBookingReportComponent } from './components/flight-booking-report/flight-booking-report.component';
import { HotelBookingReportComponent } from './components/hotel-booking-report/hotel-booking-report.component';
import { CarBookingReportComponent } from './components/car-booking-report/car-booking-report.component';
import { HotelVoucherComponent } from './components/booking-details/hotel-voucher/hotel-voucher.component';
import { UpdatePnrTicketComponent } from './components/flight-booking-report/components/update-pnr-ticket/update-pnr-ticket.component';
import { FlightTrackerComponent } from './components/account-ledger/components/flight-tracker/flight-tracker.component';
import { MapCheckComponent } from './components/map-check/map-check.component';
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { TrainBookingReportComponent } from "./components/train-booking-report/train-booking-report.component";
import { TrainTicketComponent } from "./components/train-booking-report/components/train-ticket/train-ticket.component";
import { ViewTrainBookingComponent } from "./components/train-booking-report/components/view-train-booking/view-train-booking.component";
import { CarTicketComponent } from "./components/car-booking-report/components/car-ticket/car-ticket.component";
import { ViewCarBookingComponent } from "./components/car-booking-report/components/view-car-booking/view-car-booking.component";
import { IciciHotelBookingReportComponent } from './components/icici-hotel-booking-report/icici-hotel-booking-report.component';
import { HotelInvoiceComponent } from './components/booking-details/hotel-invoice/hotel-invoice.component';
import { TrainInvoiceComponent } from './components/train-booking-report/components/train-invoice/train-invoice.component';
import { CarInvoiceComponent } from './components/car-booking-report/components/car-invoice/car-invoice.component';
import { NumberToWordsPipe } from "./number-to-words.pipe";
import { BusBookingReportComponent } from './components/bus-booking-report/bus-booking-report.component';
@NgModule({
    imports: [
        LayoutsModule,
        ReportsRouterModule,
        HighchartsChartModule,
        BsDatepickerModule.forRoot(),
        TabsModule.forRoot(),
        Ng2SearchPipeModule,
        CollapseModule.forRoot(),
        TooltipModule.forRoot(),
    ],
    declarations: [
        AgentsComponent,
        TransactionLogsComponent,
        SearchHistoryComponent,
        TopDestinationsComponent,
        AccountLedgerComponent,
        DynamicTableComponent,
        AdvSearchComponent,
        BookingDetailsComponent,
        DailySalesReportComponent,
        PendingTicketComponent,
        PNRSearchComponent,
        VoucherComponent,
        SearchComponent,
        SearchFormComponent,
        FlightBookingReportComponent,
        HotelBookingReportComponent,
        CarTicketComponent,
        CarBookingReportComponent,
        ViewCarBookingComponent,
        HotelVoucherComponent,
        UpdatePnrTicketComponent,
        FlightTrackerComponent,
        MapCheckComponent,
        TrainBookingReportComponent,
        TrainTicketComponent,
        ViewTrainBookingComponent,
        IciciHotelBookingReportComponent,
        HotelInvoiceComponent,
        TrainInvoiceComponent,
        CarInvoiceComponent,
        NumberToWordsPipe,
        BusBookingReportComponent
    ],
    exports: [
        AgentsComponent,
        TransactionLogsComponent,
        SearchHistoryComponent,
        TopDestinationsComponent,
        AccountLedgerComponent,
        DynamicTableComponent,
        AdvSearchComponent,
        BookingDetailsComponent,
        DailySalesReportComponent,
        PendingTicketComponent,
        PNRSearchComponent,
    ],
    entryComponents: [ViewCarBookingComponent,ViewTrainBookingComponent]
})
export class ReportsModule { }