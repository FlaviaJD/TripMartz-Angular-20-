import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ExportAsModule } from 'ngx-export-as';
import { B2bComponent } from './CORPORATE/corporate/b2b.component';
import { CorporateFlightComponent } from './CORPORATE/corporate/corporate-flight/corporate-flight.component';
import { CorporateHotelComponent } from './CORPORATE/corporate/corporate-hotel/corporate-hotel.component';
import { LayoutsModule } from '../../layout/layout.module';
import { ReportRoutingModule } from './report.routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FlightVoucherComponent, CarVoucherComponent, HotelVoucherComponent } from './CORPORATE/index';
import { CorporateCarComponent } from './CORPORATE/corporate/corporate-car/corporate-car.component';
import { FlightInvoiceComponent } from './CORPORATE/corporate/voucher/flight-invoice/flight-invoice.component';
import { HotelInvoiceComponent } from './CORPORATE/corporate/voucher/hotel-invoice/hotel-invoice.component'
import { UpdatePnrTicketComponent } from './components/update-pnr-ticket/update-pnr-ticket.component';
import { CorporateBusComponent } from './CORPORATE/corporate/corporate-bus/corporate-bus.component';
import { CorporateTrainComponent } from './CORPORATE/corporate/corporate-train/corporate-train.component';
import { BusVoucherComponent } from './CORPORATE/corporate/voucher/bus-voucher/bus-voucher.component';
import { BusInvoiceComponent } from './CORPORATE/corporate/voucher/bus-invoice/bus-invoice.component';
import { TrainInvoiceComponent } from './CORPORATE/corporate/voucher/train-invoice/train-invoice.component';
import { TrainVoucherComponent } from './CORPORATE/corporate/voucher/train-voucher/train-voucher.component';
import { CarInvoiceComponent } from './CORPORATE/corporate/voucher/car-invoice/car-invoice.component';
import { ViewCarBookingComponent } from './CORPORATE/corporate/corporate-car/view-car-booking/view-car-booking.component';
import { ViewTrainBookingComponent } from './CORPORATE/corporate/corporate-train/view-train-booking/view-train-booking.component';
import { HotelViewComponent } from './CORPORATE/corporate/corporate-hotel/hotel-view/hotel-view.component';
import { TrainViewComponent } from './CORPORATE/corporate/corporate-train/train-view/train-view.component';
import { NumberToWordsPipe } from './CORPORATE/corporate/number-to-words.pipe';
import { CarViewComponent } from './CORPORATE/corporate/corporate-car/car-view/car-view.component';
import { FinanceFlightComponent } from './CORPORATE/corporate/finace-flight/finance-flight.component';
import { FinanceHotelComponent } from './CORPORATE/corporate/finance-hotel/finance-hotel.component';
import { FinanceViewComponent } from './CORPORATE/corporate/finance-hotel/finance-view/finance-view.component';


@NgModule({
    declarations: [
        B2bComponent,
        CorporateFlightComponent,
        CorporateHotelComponent,
        CorporateBusComponent,
        CorporateTrainComponent,
        FlightVoucherComponent,
        CarVoucherComponent,
        HotelVoucherComponent,
        CorporateCarComponent,
        ViewCarBookingComponent,
        BusVoucherComponent,
        TrainVoucherComponent,
        ViewTrainBookingComponent,
        FlightInvoiceComponent,
        FinanceFlightComponent,
        BusInvoiceComponent,
        TrainInvoiceComponent,
        HotelInvoiceComponent,
        CarInvoiceComponent,
        UpdatePnrTicketComponent,
        HotelViewComponent,
        TrainViewComponent,
        CarViewComponent,
        NumberToWordsPipe,
        FinanceHotelComponent,
        FinanceViewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        NgbModule,
        ExportAsModule,
        LayoutsModule,
        ReportRoutingModule,
        Ng2SearchPipeModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
    ],
    entryComponents: [ViewCarBookingComponent,ViewTrainBookingComponent]
})
export class ReportModule { }
