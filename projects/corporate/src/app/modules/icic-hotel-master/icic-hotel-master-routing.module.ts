import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { IcicCityListComponent } from './components/icic-city-list/icic-city-list.component';
import { IcicLocationListComponent } from './components/icic-location-list/icic-location-list.component';
import { IcicHotelListComponent } from './components/icic-hotel-list/icic-hotel-list.component';
import { IcicGuestHouseListComponent } from './components/icic-guest-house-list/icic-guest-house-list.component';

const routes: Routes = [{
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "icic-city-list",
        canActivate: [AuthGuard],
        component: IcicCityListComponent,
        data: { extraParameter: "ICICMenus" },
      },
      {
        path: "icic-location-list",
        canActivate: [AuthGuard],
        component: IcicLocationListComponent,
        data: { extraParameter: "ICICMenus" },
      },
      {
        path: "icic-hotel-list",
        canActivate: [AuthGuard],
        component: IcicHotelListComponent,
        data: { extraParameter: "ICICMenus" },
      },
      {
        path: "icic-guest-house-list",
        canActivate: [AuthGuard],
        component: IcicGuestHouseListComponent,
        data: { extraParameter: "ICICMenus" },
      }
    ],
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IcicHotelMasterRoutingModule { }
