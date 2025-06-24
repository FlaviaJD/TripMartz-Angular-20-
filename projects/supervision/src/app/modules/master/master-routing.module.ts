import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AirlineDetailsComponent } from './airline-details/airline-details.component';
import { AirportDetailsComponent } from './airport-details/airport-details.component';
import { CityDetailsComponent } from './city-details/city-details.component';
import { CountryDetailsComponent } from './country-details/country-details.component';
import { StateDetailsComponent } from './state-details/state-details.component';


const routes: Routes = [
    {
        path: "",
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: "airport-details",
                canActivate: [AuthGuard],
                component: AirportDetailsComponent,
                data: {extraParameter: ''}
            },
            {
                path: "airline-details",
                canActivate: [AuthGuard],
                component: AirlineDetailsComponent,
                data: {extraParameter: ''}
            },
            {
                path: "country-details",
                canActivate: [AuthGuard],
                component: CountryDetailsComponent,
                data: {extraParameter: ''}
            },
            {
                path: "state-details",
                canActivate: [AuthGuard],
                component: StateDetailsComponent,
                data: {extraParameter: ''}
            },
            {
                path: "city-details",
                canActivate: [AuthGuard],
                component: CityDetailsComponent,
                data: {extraParameter: ''}
            }
           
        ],
    },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }

