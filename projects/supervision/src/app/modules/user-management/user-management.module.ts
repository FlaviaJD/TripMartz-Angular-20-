import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-management.routing.module';
import { LayoutsModule } from '../../layout/layout.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { SubAdminActiveComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active.component';
import { CreateSubAdminComponent } from './manage-subAdmin/subAdmin-active/create-sub-admin/create-sub-admin.component';
import { SubAdminActiveListComponent } from './manage-subAdmin/subAdmin-active/sub-admin-active-list/sub-admin-active-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminProfileComponent } from './users/admin-profile/admin-profile.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { PrivilegesComponent } from './privileges/privileges.component';
import { CorporateActiveComponent } from './manage-corporate/corporate/manageCorporate/corporate-active/corporate-active.component';
import { ManageActiveCreateCorporateComponent } from './manage-corporate/corporate/manageCorporate/corporate-active/manage-active-create-corporate/manage-active-create-corporate.component';
import { CorporateActiveListComponent } from './manage-corporate/corporate/manageCorporate/corporate-active/corporate-active-list/corporate-active-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgentActiveComponent } from './manage-agent/agent-active/agent-active.component';
import { AgentActiveListComponent } from './manage-agent/agent-active-list/agent-active-list.component';
import { ManageActiveCreateAgentComponent } from './manage-agent/manage-active-create-agent/manage-active-create-agent.component';
import { FinanceCreateComponent } from './manage-finance/finance-create/finance-create.component';
import { FinanceListComponent } from './manage-finance/finance-list/finance-list.component';
import { ManageFinanceComponent } from './manage-finance/manage-finance-active/manage-finance.component';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
    declarations: [  CorporateActiveComponent, ManageActiveCreateCorporateComponent, AgentActiveComponent, AgentActiveListComponent, ManageActiveCreateAgentComponent,
        AdminProfileComponent, ChangePasswordComponent,CorporateActiveListComponent,SubAdminActiveComponent,CreateSubAdminComponent,SubAdminActiveListComponent,PrivilegesComponent,
        FinanceCreateComponent,FinanceListComponent, ManageFinanceComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        LayoutsModule,
        Ng2SearchPipeModule,
        SharedModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        NgMultiSelectDropDownModule.forRoot()
    ]
})
export class UserManagementModule { }
