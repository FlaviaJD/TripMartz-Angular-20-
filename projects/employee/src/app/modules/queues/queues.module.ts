import { NgModule } from '@angular/core';
import { QueuesRoutingModule } from './queues-routing.module';
import {
    FlightCancellationComponent
} from './components';
import { LayoutsModule } from '../../layout/layout.module';
import { FlightScheduleChangesComponent } from './components/flight-schedule-changes/flight-schedule-changes.component';
import { FlightBookingQueueComponent } from './components/flight-booking-queue/flight-booking-queue.component';
import { SearchQueueComponent } from './components/search-queue/search-queue.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TrainBookingQueueComponent } from './components/train-booking-queue/train-booking-queue.component';
import { CarBookingQueueComponent } from './components/car-booking-queue/car-booking-queue.component';
import { HotelBookingQueueComponent } from './components/hotel-booking-queue/hotel-booking-queue.component';

@NgModule({
    imports: [
        LayoutsModule,
        QueuesRoutingModule,
        Ng2SearchPipeModule,
        BsDatepickerModule.forRoot(),
    ],
    declarations: [
        FlightCancellationComponent,
        FlightScheduleChangesComponent,
        FlightBookingQueueComponent,
        SearchQueueComponent,
        TrainBookingQueueComponent,
        CarBookingQueueComponent,
        TrainBookingQueueComponent,
        HotelBookingQueueComponent
    ]
})
export class QueuesModule { }
