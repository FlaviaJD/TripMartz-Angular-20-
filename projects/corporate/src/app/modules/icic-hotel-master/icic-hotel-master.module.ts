import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IcicHotelMasterRoutingModule } from './icic-hotel-master-routing.module';
import { IcicCityListComponent } from './components/icic-city-list/icic-city-list.component';
import { LayoutsModule } from '../../layout/layout.module';
import { CityListComponent } from './components/icic-city-list/city-list/city-list.component';
import { CreateUpdateCityListComponent } from './components/icic-city-list/create-update-city-list/create-update-city-list.component';
import { IcicLocationListComponent } from './components/icic-location-list/icic-location-list.component';
import { CreateUpdateLocationListComponent } from './components/icic-location-list/create-update-location-list/create-update-location-list.component';
import { LocationListComponent } from './components/icic-location-list/location-list/location-list.component';
import { IcicHotelListComponent } from './components/icic-hotel-list/icic-hotel-list.component';
import { CreateUpdateHotelListComponent } from './components/icic-hotel-list/create-update-hotel-list/create-update-hotel-list.component';
import { HotelListComponent } from './components/icic-hotel-list/hotel-list/hotel-list.component';
import { IcicGuestHouseListComponent } from './components/icic-guest-house-list/icic-guest-house-list.component';
import { CreateUpdateGuestListComponent } from './components/icic-guest-house-list/create-update-guest-list/create-update-guest-list.component';
import { GuestHouseListComponent } from './components/icic-guest-house-list/guest-house-list/guest-house-list.component';
import { Ng2SearchPipeModule } from "ng2-search-filter";


@NgModule({
  declarations: [IcicCityListComponent, CityListComponent, CreateUpdateCityListComponent, IcicLocationListComponent, CreateUpdateLocationListComponent, LocationListComponent, IcicHotelListComponent, CreateUpdateHotelListComponent, HotelListComponent, IcicGuestHouseListComponent, CreateUpdateGuestListComponent, GuestHouseListComponent],
  imports: [
    CommonModule,
    LayoutsModule,
    IcicHotelMasterRoutingModule,
    Ng2SearchPipeModule
  ]
})
export class IcicHotelMasterModule { }
