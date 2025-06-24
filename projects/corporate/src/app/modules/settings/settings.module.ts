import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { ManageDomainsComponent } from "./components/manage-domains/manage-domains.component";
import { LayoutsModule } from "../../layout/layout.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { DomainLogoComponent } from "./components/domain-logo/domain-logo.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
  declarations: [
    ManageDomainsComponent,
    DomainLogoComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    LayoutsModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class SettingsModule {}
