import { NgModule } from "@angular/core";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";
import { FullCalendarModule } from "@fullcalendar/angular"; // for FullCalendar!
import { HighchartsChartModule } from "highcharts-angular";
import { SearchModule } from "../search/search.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {
  LatestMembersComponent,
  RecentBookingTransactionsComponent,
} from "./components";
import { LayoutsModule } from "../../layout/layout.module";
import { FlightEligibilityComponent } from './components/flight-eligibility/flight-eligibility.component';
import { HotelEligibilityComponent } from './components/hotel-eligibility/hotel-eligibility.component';
import { BusEligibilityComponent } from './components/bus-eligibility/bus-eligibility.component';
import { TrainEligibilityComponent } from './components/train-eligibility/train-eligibility.component';
import { CarEligibilityComponent } from './components/car-eligibility/car-eligibility.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LatestMembersComponent,
    RecentBookingTransactionsComponent,
    FlightEligibilityComponent,
    HotelEligibilityComponent,
    BusEligibilityComponent,
    TrainEligibilityComponent,
    CarEligibilityComponent,
  ],

  imports: [
    DashboardRoutingModule,
    SearchModule,
    FullCalendarModule,
    NgbModule,
    TabsModule.forRoot(),
    HighchartsChartModule,
    LayoutsModule,
  ],
})
export class DashboardModule {}
