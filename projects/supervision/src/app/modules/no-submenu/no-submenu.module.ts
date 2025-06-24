import { NgModule } from '@angular/core';
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from '../../shared/shared.module';
import { NoSubmenuRoutingModule } from './no-submenu-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
    BankAccountDetailsComponent,
    ListComponent,
    AddComponent,
    SeoComponent,
    EditComponent,
    AgentCallbackSupportComponent,
    TransactionLogsComponent
} from './components';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LogComponent } from './components/transaction-logs/log/log.component';
import { FlightComponent, HotelComponent, CarComponent } from './components';
import { AgentBalanceComponent } from './components/agent-balance/agent-balance.component';
import { ImportPnrComponent } from './components/import-pnr/import-pnr.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { GstDetailsComponent } from './components/gst-details/gst-details.component';
import { GstAddUpdateComponent } from './components/gst-details/gst-add-update/gst-add-update.component';
import { GstListComponent } from './components/gst-details/gst-list/gst-list.component';
import { HotelQueuesDetailsComponent } from './components/hotel-queues-details/hotel-queues-details.component';
import { HotelQueuesComponent } from './components/hotel-queues-details/hotel-queues/hotel-queues.component';
import { UpdateHotelQueuesComponent } from './components/hotel-queues-details/update-hotel-queues/update-hotel-queues.component';
import { TrainQueueDetailsComponent } from './components/train-queue-details/train-queue-details.component';
import { TrainQueueComponent } from './components/train-queue-details/train-queue/train-queue.component';
import { UpdateTrainQueuesComponent } from './components/train-queue-details/update-train-queues/update-train-queues.component';
import { CabDetailsComponent } from './components/cab-details/cab-details.component';
import { CabQueuesComponent } from './components/cab-details/cab-queues/cab-queues.component';
import { UpdateCabQueuesComponent } from './components/cab-details/update-cab-queues/update-cab-queues.component';
import { HotelStateListComponent } from './components/hotel-queues-details/hotel-state-list/hotel-state-list.component';
import { IciciHotelQueuesDetailsComponent } from './components/icici-hotel-queues-details/icici-hotel-queues-details.component';
import { IciciHotelQueuesComponent } from './components/icici-hotel-queues-details/icici-hotel-queues/icici-hotel-queues.component';
import { IciciUpdateHotelQueuesComponent } from './components/icici-hotel-queues-details/icici-update-hotel-queues/icici-update-hotel-queues.component';
import { DatePipe } from '@angular/common';
import { CancellationHotelQueuesDetailsComponent } from './components/cancellation-hotel-queues-details/cancellation-hotel-queues-details.component';
import { CancellationHotelQueuesComponent } from './components/cancellation-hotel-queues-details/cancellation-hotel-queues/cancellation-hotel-queues.component';
import { UpdateCancellationHotelQueuesComponent } from './components/cancellation-hotel-queues-details/update-cancellation-hotel-queues/update-cancellation-hotel-queues.component';

import { GstService } from './components/gst-details/gst.service';
import { DualListboxComponent } from './components/train-queue-details/dual-listbox/dual-listbox.component';
import { CancellationTrainQueuesDetailsComponent } from './components/cancellation-train-queues-details/cancellation-train-queues-details.component';
import { UpdateCancellationTrainQueuesComponent } from './components/cancellation-train-queues-details/update-cancellation-train-queues/update-cancellation-train-queues.component';
import { CancellationTrainQueuesComponent } from './components/cancellation-train-queues-details/cancellation-train-queues/cancellation-train-queues.component';
import { CancellationCabQueuesDetailsComponent } from './components/cancellation-cab-queues-details/cancellation-cab-queues-details.component';
import { CancellationCabQueuesComponent } from './components/cancellation-cab-queues-details/cancellation-cab-queues/cancellation-cab-queues.component';
import { UpdateCancellationCabQueuesComponent } from './components/cancellation-cab-queues-details/update-cancellation-cab-queues/update-cancellation-cab-queues.component';
import { IcicHotelDetailsComponent } from './components/icici-hotel-queues-details/icic-hotel-details/icic-hotel-details.component';
import { TrainRequestComponent } from './components/train-queue-details/train-request/train-request.component';
import { TrainCancelRequestComponent } from './components/cancellation-train-queues-details/train-cancel-request/train-cancel-request.component';
import { HotelCancelRequestComponent } from './components/cancellation-hotel-queues-details/cancellation-hotel-queues/hotel-cancel-request/hotel-cancel-request.component';
import { CorporateCodeComponent } from './components/corporate-code/corporate-code.component';
import { CorporateCodeAddUpdateComponent } from './components/corporate-code/corporate-code-add-update/corporate-code-add-update.component';
import { CorporateCodeListComponent } from './components/corporate-code/corporate-code-list/corporate-code-list.component';
import { AirlineGstComponent } from './components/airline-gst/airline-gst.component';
import { AirlineGstAddUpdateComponent } from './components/airline-gst/airline-gst-add-update/airline-gst-add-update.component';
import { AirlineGstListComponent } from './components/airline-gst/airline-gst-list/airline-gst-list.component';
import { DcbHotelDetailsComponent } from './components/hotel-queues-details/dcb-hotel-details/dcb-hotel-details.component';
import { CabRequestComponent } from './components/cab-details/cab-queues/cab-request/cab-request.component';
import { CabCancellationRequestComponent } from './components/cancellation-cab-queues-details/cab-cancellation-request/cab-cancellation-request.component';
import { FinaceGstAddUpdateComponent } from './components/gst-details/finance-gst-add-update/finace-gst-add-update.component';
import { FinanceGstDetailsComponent } from './components/gst-details/finance-gst-details.component';
import { FinanceGstListComponent } from './components/gst-details/finance-gst-list/finance-gst-list.component';
import { FinanceAirlineGstComponent } from './components/finance-airline-gst/finance-airline-gst.component';
import { FinanceAirlineGSTService } from './components/finance-airline-gst/finance-airline-gst.service';
import { FinanceAirlineGstAddUpdateComponent } from './components/finance-airline-gst/financial-airline-gst-add-update/financial-airline-gst-add-update.component';
import { FinanceAirlineGstListComponent } from './components/finance-airline-gst/finance-airline-gst-list/finance-airline-gst-list.component';
// import { FinaceGstListComponent } from './components/gst-details/finance-gst-list/finance-gst-list.component';
// import { FinanceGstListComponent } from './components/gst-details/finance-gst-list/finance-gst-list.component';

@NgModule({
    declarations: [
        BankAccountDetailsComponent,
        ListComponent,
        AddComponent,
        SeoComponent,
        EditComponent,
        AgentCallbackSupportComponent,
        TransactionLogsComponent,
        LogComponent,
        FlightComponent,
        HotelComponent,
        CarComponent,
        AgentBalanceComponent,
        ImportPnrComponent,
        CreditLimitComponent,
        GstDetailsComponent,
        GstAddUpdateComponent,
        GstListComponent,
        HotelQueuesComponent,
        TrainQueueComponent,
        CabQueuesComponent,
        HotelQueuesDetailsComponent,
        UpdateHotelQueuesComponent,
        TrainQueueDetailsComponent,
        UpdateTrainQueuesComponent,
        CabDetailsComponent,
        UpdateCabQueuesComponent,
        HotelStateListComponent,
        IciciHotelQueuesDetailsComponent,
        IciciHotelQueuesComponent,
        IciciUpdateHotelQueuesComponent,
        CancellationHotelQueuesDetailsComponent,
        CancellationHotelQueuesComponent,
        UpdateCancellationHotelQueuesComponent,
        DualListboxComponent,
        CancellationTrainQueuesDetailsComponent,
        UpdateCancellationTrainQueuesComponent,
        CancellationTrainQueuesComponent,
        CancellationCabQueuesDetailsComponent,
        CancellationCabQueuesComponent,
        UpdateCancellationCabQueuesComponent,
        IcicHotelDetailsComponent,
        TrainRequestComponent,
        TrainCancelRequestComponent,
        HotelCancelRequestComponent,
        CorporateCodeComponent,
        CorporateCodeAddUpdateComponent,
        CorporateCodeListComponent,
        AirlineGstComponent,
        AirlineGstAddUpdateComponent,
        AirlineGstListComponent,
        DcbHotelDetailsComponent,
        CabRequestComponent,
        CabCancellationRequestComponent,
        FinaceGstAddUpdateComponent,
        FinanceGstDetailsComponent,
        FinanceGstListComponent,
        FinanceAirlineGstComponent,
        FinanceAirlineGstAddUpdateComponent,
        FinanceAirlineGstListComponent

 ],
    imports: [
        SharedModule,
        NoSubmenuRoutingModule,
        BsDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        Ng2SearchPipeModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule.forRoot()
    ],
    providers: [
        DatePipe,
        GstService,
        FinanceAirlineGSTService
    ]
})
export class NoSubmenuModule { }
