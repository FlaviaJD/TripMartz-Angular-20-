import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { AirportDetailsComponent } from './airport-details/airport-details.component';
import { AirlineDetailsComponent } from './airline-details/airline-details.component';
import { StateDetailsComponent } from './state-details/state-details.component';
import { CityDetailsComponent } from './city-details/city-details.component';
import { CountryDetailsComponent } from './country-details/country-details.component';
import { LayoutsModule } from '../../layout/layout.module';
import { AddUpdateAirportComponent } from './airport-details/add-update-airport/add-update-airport.component';
import { AirportListComponent } from './airport-details/airport-list/airport-list.component';
import { AddUpdateAirlineComponent } from './airline-details/add-update-airline/add-update-airline.component';
import { AirlineListComponent } from './airline-details/airline-list/airline-list.component';
import { AddUpdateCountryComponent } from './country-details/add-update-country/add-update-country.component';
import { CountryListComponent } from './country-details/country-list/country-list.component';
import { StateListComponent } from './state-details/state-list/state-list.component';
import { AddUpdateStateComponent } from './state-details/add-update-state/add-update-state.component';
import { AddUpdateCityComponent } from './city-details/add-update-city/add-update-city.component';
import { CityListComponent } from './city-details/city-list/city-list.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [AirportDetailsComponent, AirlineDetailsComponent, StateDetailsComponent, CityDetailsComponent, CountryDetailsComponent, AddUpdateAirportComponent, AirportListComponent, AddUpdateAirlineComponent, AirlineListComponent, AddUpdateCountryComponent, CountryListComponent, StateListComponent, AddUpdateStateComponent, AddUpdateCityComponent, CityListComponent],
  imports: [
    CommonModule,
    LayoutsModule,
    MasterRoutingModule,
    Ng2SearchPipeModule

  ]
})
export class MasterModule { 
}
