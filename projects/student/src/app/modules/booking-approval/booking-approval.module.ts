import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingApprovalRoutingModule } from './booking-approval-routing.module';
import { BookingApprovalTabsComponent } from './booking-approval-tabs/booking-approval-tabs.component';
import { LayoutsModule } from '../../layout/layout.module';
import { FlightApprovalComponent } from './flight-approval/flight-approval.component';
import { HotelApprovalComponent } from './hotel-approval/hotel-approval.component';
import { TrainApprovalComponent } from './train-approval/train-approval.component';
import { CarApprovalComponent } from './car-approval/car-approval.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HotelApprovalTemplateComponent } from './hotel-approval-template/hotel-approval-template.component';
import { TrainApprovalTemplateComponent } from './train-approval-template/train-approval-template.component';
import { CarApprovalTemplateComponent } from './car-approval-template/car-approval-template.component';
import { PolicyApprovalComponent } from './policy-approval/policy-approval.component';
import { PolicyconfirmationComponent } from './policyconfirmation/policyconfirmation.component';
import { BusApprovalComponent } from './bus-approval/bus-approval.component';
import { HotelBookingApprovalComponent } from './hotel-booking-approval/hotel-booking-approval.component';
import { FlightApprovalListComponent } from './flight-approval-list/flight-approval-list.component';
import { HotelRoomSelectionComponent } from './hotel-room-selection/hotel-room-selection.component';
import { BookingRequestTabsComponent } from '../booking-request/booking-request-tabs/booking-request-tabs.component';
import { FlightRequestComponent } from '../booking-request/flight-request/flight-request.component';
import { HotelRequestComponent } from '../booking-request/hotel-request/hotel-request.component';
import { BusRequestComponent } from '../booking-request/bus-request/bus-request.component';


@NgModule({
  declarations: [BookingApprovalTabsComponent,BookingRequestTabsComponent, FlightApprovalComponent, HotelApprovalComponent, TrainApprovalComponent, CarApprovalComponent, HotelApprovalTemplateComponent, TrainApprovalTemplateComponent, CarApprovalTemplateComponent, PolicyApprovalComponent, PolicyconfirmationComponent,BusApprovalComponent, HotelBookingApprovalComponent, FlightApprovalListComponent, HotelRoomSelectionComponent,FlightRequestComponent,HotelRequestComponent,BusRequestComponent],
  imports: [
    CommonModule,
    FormsModule,
    BookingApprovalRoutingModule,
    LayoutsModule,
    Ng2SearchPipeModule
  ]
})
export class BookingApprovalModule { 
}
