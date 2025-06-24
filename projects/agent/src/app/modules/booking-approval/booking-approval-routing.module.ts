import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { BookingApprovalTabsComponent } from './booking-approval-tabs/booking-approval-tabs.component';
import { HotelApprovalTemplateComponent } from './hotel-approval-template/hotel-approval-template.component';
import { TrainApprovalTemplateComponent } from './train-approval-template/train-approval-template.component';
import { CarApprovalTemplateComponent } from './car-approval-template/car-approval-template.component';
import { PolicyApprovalComponent } from './policy-approval/policy-approval.component';
import { PolicyconfirmationComponent } from './policyconfirmation/policyconfirmation.component';
import { HotelBookingApprovalComponent } from './hotel-booking-approval/hotel-booking-approval.component';
import { FlightApprovalListComponent } from './flight-approval-list/flight-approval-list.component';
import { HotelRoomSelectionComponent } from './hotel-room-selection/hotel-room-selection.component';
import { BookingRequestTabsComponent } from '../booking-request/booking-request-tabs/booking-request-tabs.component';


const routes: Routes = [
    {
        path: '',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'approval',
                component: BookingApprovalTabsComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'request-list',
                component: BookingRequestTabsComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'hotel-approval-template',
                component: HotelApprovalTemplateComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'train-approval-template',
                component: TrainApprovalTemplateComponent,
                data: { extraParameters: '' }
            },
            {
                path: 'car-approval-template',
                component: CarApprovalTemplateComponent,
                data: { extraParameters: '' }
            },
            { path: 'policy-approval', component: PolicyApprovalComponent, data: { extraParameter: '' } },
            { path: 'booking-approval', component: HotelBookingApprovalComponent, data: { extraParameter: '' } },
            { path: 'hotel-room-selection', component: HotelRoomSelectionComponent, data: { extraParameter: '' } },
            { path: 'flight-approval', component: FlightApprovalListComponent, data: { extraParameter: '' } },
            { path: 'policy-confirmation', component: PolicyconfirmationComponent, data: { extraParameter: '' } },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookingApprovalRoutingModule { }
