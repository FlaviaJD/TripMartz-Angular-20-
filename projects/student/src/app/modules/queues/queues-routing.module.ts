import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { FlightCancellationComponent,FlightScheduleChangesComponent,FlightBookingQueueComponent } from './components';
import { CarBookingQueueComponent } from './components/car-booking-queue/car-booking-queue.component';
import { HotelBookingQueueComponent } from './components/hotel-booking-queue/hotel-booking-queue.component';
import { TrainBookingQueueComponent } from './components/train-booking-queue/train-booking-queue.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    data: {extraParameter: 'queuesMenus'},
    children: [
      {
        path: 'flight-cancellation',
        component: FlightCancellationComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'flight-schedule-changes',
        component: FlightScheduleChangesComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'flight-booking-queue',
        component: FlightBookingQueueComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'hotel-booking-queue',
        component: HotelBookingQueueComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'train-booking-queue',
        component: TrainBookingQueueComponent,
        data: {extraParameter: 'queuesMenus'}
      },
      {
        path: 'car-booking-queue',
        component: CarBookingQueueComponent,
        data: {extraParameter: 'queuesMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueuesRoutingModule { }
