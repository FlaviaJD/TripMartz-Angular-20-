import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { FlightMisDownloadsComponent } from "./components/flight-mis-downloads/flight-mis-downloads.component";
import { HotelMisDownloadsComponent } from "./components/hotel-mis-downloads/hotel-mis-downloads.component";
import { TrainMisDownloadsComponent } from "./components/train-mis-downloads/train-mis-downloads.component";
import { BusMisDownloadsComponent } from "./components/bus-mis-downloads/bus-mis-downloads.component";
import { CabMisDownloadsComponent } from "./components/cab-mis-downloads/cab-mis-downloads.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "flight",
        canActivate: [AuthGuard],
        component: FlightMisDownloadsComponent,
        data: { extraParameter: "misDownloadsMenus" },
      },
      {
        path: "hotel",
        canActivate: [AuthGuard],
        component: HotelMisDownloadsComponent,
        data: { extraParameter: "misDownloadsMenus" },
      },
      {
        path: "train",
        canActivate: [AuthGuard],
        component: TrainMisDownloadsComponent,
        data: { extraParameter: "misDownloadsMenus" },
      },
      {
        path: "bus",
        canActivate: [AuthGuard],
        component: BusMisDownloadsComponent,
        data: { extraParameter: "misDownloadsMenus" },
      },
      {
        path: "cab",
        canActivate: [AuthGuard],
        component: CabMisDownloadsComponent,
        data: { extraParameter: "misDownloadsMenus" },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MISDownloadsRoutingModule { }
