import { NgModule } from '@angular/core';
import { MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SharedModule } from '../../shared/shared.module';
import { NoSubmenuRoutingModule } from './no-submenu-routing.module';
import {
    BankAccountDetailsComponent,
    ListComponent,
    AddComponent,
    SeoComponent,
    EditComponent,
    EmployeeCallbackSupportComponent,
    TransactionLogsComponent
} from './components';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LogComponent } from './components/transaction-logs/log/log.component';
import { FlightComponent, HotelComponent, CarComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditLimitComponent } from './components/credit-limit/credit-limit.component';
import { SupportDocumentsComponent } from './components';
import { SendLatestNewsComponent } from './components';


@NgModule({
    declarations: [
        BankAccountDetailsComponent,
        ListComponent,
        AddComponent,
        SeoComponent,
        EditComponent,
        EmployeeCallbackSupportComponent,
        TransactionLogsComponent,
        LogComponent,
        FlightComponent,
        HotelComponent,
        CarComponent,
        CreditLimitComponent,
        SupportDocumentsComponent,
        SendLatestNewsComponent
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
        ReactiveFormsModule
    ]
})
export class NoSubmenuModule { }
