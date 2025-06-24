import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { LayoutsModule } from "../../layout/layout.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { BillingRoutingModule } from "./billing-routing.module";
import { BillingInvoiceComponent } from "./components/billing-invoice/billing-invoice.component";
import { BillingApprovalComponent } from "./components/billing-approval/billing-approval.component";
import { ViewInvoiceComponent } from "./components/billing-invoice/view-invoice/view-invoice.component";

@NgModule({
    declarations: [
        BillingInvoiceComponent,
        BillingApprovalComponent,
        ViewInvoiceComponent
    ],
    imports: [
      CommonModule,
      BillingRoutingModule,
      SharedModule,
      LayoutsModule,
      Ng2SearchPipeModule,
      NgMultiSelectDropDownModule.forRoot(),
    ],
  })
  export class BillingModule {}
  