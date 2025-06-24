import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { HighchartsChartModule } from 'highcharts-angular';
import { LatestMembersComponent, RecentBookingTransactionsComponent } from './components';
import { SharedModule } from '../../shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChartsModule, ThemeService } from 'ng2-charts';
@NgModule({
  
  declarations: [
    DashboardComponent,
    LatestMembersComponent,
    RecentBookingTransactionsComponent,
  ],

  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    DashboardRoutingModule,
    FullCalendarModule,
    HighchartsChartModule,
    SharedModule,
    ChartsModule,
    TooltipModule.forRoot(),
  ],
  providers:[ThemeService]
})
export class DashboardModule { }
