import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { AppearanceComponent } from "./components/appearance/appearance.component";
import { ConvenienceFeesComponent } from "./components/convenience-fees/convenience-fees.component";
import { CurrencyConversionComponent } from "./components/currency-conversion/currency-conversion.component";
import { EventLogsComponent } from "./components/event-logs/event-logs.component";
import { LiveEventsComponent } from "./components/live-events/live-events.component";
import { ManageApiComponent } from "./components/manage-api/manage-api.component";
import { ManageCmsComponent } from "./components/manage-sms/manage-cms.component";
import { ManageDomainsComponent } from "./components/manage-domains/manage-domains.component";
import { PromocodeComponent } from "./components/promocode/promocode.component";
import { ListPromocodeComponent } from "./components/promocode/list-promocode/list-promocode.component";
import { UpdatePromocodeComponent } from "./components/promocode/update-promocode/update-promocode.component";
import { SocialLoginComponent } from "./components/social-login/social-login.component";
import { SocialNetworksComponent } from "./components/social-networks/social-networks.component";
import { TravelInsuranceComponent } from "./components/travel-insurance/travel-insurance.component";
import { ApiCurrencyRateListComponent } from "./components/api-currency-rate-list/api-currency-rate-list.component";
import {
  ActivityApiComponent,
  CarApiComponent,
  HotelApiComponent,
  FlightApiComponent,
} from "./components/manage-api/components";
import { LayoutsModule } from "../../layout/layout.module";
import { PushNotificationsComponent } from "./components/push-notifications/push-notifications.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { ManagePaymnetGatewayComponent } from './components/manage-paymnet-gateway/manage-paymnet-gateway.component';
import { DomainLogoComponent } from "./components/domain-logo/domain-logo.component";
import { AddCurrencyComponent } from './components/add-currency/add-currency.component';
import { UpdateLastTicketingDurationComponent } from "./components/social-login/update-last-ticketing-duration/update-last-ticketing-duration.component";
import { UpdateTicketingDurationComponent } from "./components/social-login/update-last-ticketing-duration/update-ticketing-duration/update-ticketing-duration.component";
import { UpdatedListingComponent } from "./components/social-login/update-last-ticketing-duration/updated-listing/updated-listing.component";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { B2cPaymentGatewayChargesComponent } from "./components/b2c-payment-gateway-charges/b2c-payment-gateway-charges.component";

@NgModule({
  declarations: [
    AppearanceComponent,
    ConvenienceFeesComponent,
    CurrencyConversionComponent,
    EventLogsComponent,
    LiveEventsComponent,
    ManageApiComponent,
    ActivityApiComponent,
    CarApiComponent,
    HotelApiComponent,
    FlightApiComponent,
    ManageCmsComponent,
    ManageDomainsComponent,
    PromocodeComponent,
    ListPromocodeComponent,
    UpdatePromocodeComponent,
    SocialLoginComponent,
    SocialNetworksComponent,
    TravelInsuranceComponent,
    ApiCurrencyRateListComponent,
    PushNotificationsComponent,
    DomainLogoComponent,
    ManagePaymnetGatewayComponent,
    AddCurrencyComponent,
    UpdateLastTicketingDurationComponent,
    UpdateTicketingDurationComponent,
    UpdatedListingComponent,
    B2cPaymentGatewayChargesComponent
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
