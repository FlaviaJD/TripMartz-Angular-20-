import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { ManageDomainsComponent } from "./components/manage-domains/manage-domains.component";
import { DomainLogoComponent } from "./components/domain-logo/domain-logo.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "domain-logo",
        canActivate: [AuthGuard],
        component: DomainLogoComponent,
        data: { extraParameter: "settingsMenus" },
      },
      {
        path: "manage-domains",
        canActivate: [AuthGuard],
        component: ManageDomainsComponent,
        data: { extraParameter: "settingsMenus" },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
