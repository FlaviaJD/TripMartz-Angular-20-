import {
  DevToolsExtension,
  NgRedux,
  NgReduxModule,
} from "@angular-redux/store";
import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { NgBootstrapFormValidationModule } from "ng-bootstrap-form-validation";
import { ExportAsModule } from "ngx-export-as";
import { NgxLoadingModule } from "ngx-loading";
import {
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG,
} from "ngx-perfect-scrollbar";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { CommissionModule } from "projects/agent/src/app/modules/commission/commission.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AuthModule } from "./auth/auth.module";
import { CoreModule } from "./core/core.module";
import { AuthInterceptorService } from "./core/interceptor/auth-interceptor.service";
import { LayoutsModule } from "./layout/layout.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { CmsModule } from "./modules/cms/cms.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { EmailSubscriptionsModule } from "./modules/email-subscriptions/email-subscriptions.module";
import { HeaderModule } from "./modules/header/header.module";
import { HotelCrsModule } from "./modules/hotel-crs/hotel-crs.module";
import { ManageCountryStateCityModule } from "./modules/manage-country-state-city/manage-country-state-city.module";
import { MasterBalanceManagerModule } from "./modules/master-balance-manager/master-balance-manager.module";
import { NoSubmenuModule } from "./modules/no-submenu/no-submenu.module";
import { OfflineModule } from "./modules/offline/offline.module";
import { OtherModule } from "./modules/other/other.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { QueuesModule } from "./modules/queues/queues.module";
import { RewardsB2cModule } from "./modules/rewards-b2c/rewards-b2c.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { SupplierManagementModule } from "./modules/supplier-management/supplier-management.module";
import { UsersModule } from "./modules/users/users.module";
import { SharedModule } from "./shared/shared.module";
import { ThemeOptions } from "./theme-options";
import { ArchitectUIState, rootReducer } from "./ThemeOptions/store";
import { ConfigActions } from "./ThemeOptions/store/config.actions";
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from "@angular/common";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgReduxModule,
    NgBootstrapFormValidationModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    LoadingBarRouterModule,
    SlickCarouselModule,
    CoreModule,
    SharedModule,
    DashboardModule,
    LayoutModule,
    LayoutsModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    QueuesModule,
    CommissionModule,
    SettingsModule,
    MasterBalanceManagerModule,
    EmailSubscriptionsModule,
    CmsModule,
    OfflineModule,
    NoSubmenuModule,
    OtherModule,
    ExportAsModule,
    HotelCrsModule,
    PaymentModule,
    AppRoutingModule,
    HeaderModule,
    SupplierManagementModule,
    ManageCountryStateCityModule,
    RewardsB2cModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      // DROPZONE_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ConfigActions,
    ThemeOptions,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<ArchitectUIState>,
    devTool: DevToolsExtension
  ) {
    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : (f) => f]
    );
  }
}
