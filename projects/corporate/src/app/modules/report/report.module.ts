import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ExportAsModule } from 'ngx-export-as';
// import { B2bComponent } from './booking/b2b/b2b.component';
import { BookingFlightComponent } from './booking/booking-flight/booking-flight.component';
import { BookingHotelComponent } from './booking/booking-hotel/booking-hotel.component';
import { LayoutsModule } from '../../layout/layout.module';
import { ReportRoutingModule } from './report.routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FlightComponent, CarComponent, HotelComponent, TrainComponent, BusComponent } from './booking/index';
import { BookingCarComponent } from './booking/booking-car/booking-car.component';
import { BookingFlightInvoiceComponent } from './booking/voucher/booking-flight-invoice/booking-flight-invoice.component';
import { BookingHotelInvoiceComponent } from './booking/voucher/booking-hotel-invoice/booking-hotel-invoice.component'
import { BookingTrainComponent } from './booking/booking-train/booking-train.component';
import { BookingBusComponent } from './booking/booking-bus/booking-bus.component';
import { BookingTrainInvoiceComponent } from './booking/voucher/booking-train-invoice/booking-train-invoice.component';
import { BookingBusInvoiceComponent } from './booking/voucher/booking-bus-invoice/booking-bus-invoice.component';
import { BookingCarInvoiceComponent } from './booking/voucher/booking-car-invoice/booking-car-invoice.component';
import { NumberToWordsPipe } from './booking/number-to-words.pipe';
import { BookingBusVoucherComponent } from './booking/voucher/booking-bus-voucher/booking-bus-voucher.component';

@NgModule({
    declarations: [
        // B2bComponent,
        BookingFlightComponent,
        BookingHotelComponent,
        FlightComponent,
        CarComponent,
        HotelComponent,
        BookingCarComponent,
        BookingFlightInvoiceComponent,
        BookingHotelInvoiceComponent,
        BookingTrainComponent,
        BookingBusComponent,
        TrainComponent,
        BookingBusVoucherComponent,
        BusComponent,
        BookingTrainInvoiceComponent,
        BookingBusInvoiceComponent,
        BookingCarInvoiceComponent,
        NumberToWordsPipe
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
    ], exports: [
        BookingFlightInvoiceComponent
    ]
})
export class ReportModule { }
