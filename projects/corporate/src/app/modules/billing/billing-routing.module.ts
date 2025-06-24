import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { BillingInvoiceComponent } from "./components/billing-invoice/billing-invoice.component";
import { BillingApprovalComponent } from "./components/billing-approval/billing-approval.component";
import { ViewInvoiceComponent } from "./components/billing-invoice/view-invoice/view-invoice.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "invoice",
        canActivate: [AuthGuard],
        component: BillingInvoiceComponent,
        data: { extraParameter: "billingMenus" },
      },
      {
        path: "approval",
        canActivate: [AuthGuard],
        component: BillingApprovalComponent,
        data: { extraParameter: "billingMenus" },
      },
      {
        path: "invoice/view",
        canActivate: [AuthGuard],
        component: ViewInvoiceComponent,
        data: { extraParameter: "" },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule { }
