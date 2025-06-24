import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { FlightMisDownloadsComponent } from "./components/flight-mis-download/flight-mis-download.component";
import { TrainMisDownloadComponent } from "./components/train-mis-download/train-mis-download.component";
import { BusMisDownloadComponent } from "./components/bus-mis-download/bus-mis-download.component";
import { CabMisDownloadComponent } from "./components/cab-mis-download/cab-mis-download.component";
import { HotelMisDownloadComponent } from "./components/hotel-mis-download/hotel-mis-download.component";
import { CmsMisDownloadsComponent } from "./components/cms-mis-downloads/cms-mis-downloads.component";

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
                component: HotelMisDownloadComponent,
                data: { extraParameter: "misDownloadsMenus" },
            },
            {
                path: "train",
                canActivate: [AuthGuard],
                component: TrainMisDownloadComponent,
                data: { extraParameter: "misDownloadsMenus" },
            },
            {
                path: "bus",
                canActivate: [AuthGuard],
                component: BusMisDownloadComponent,
                data: { extraParameter: "misDownloadsMenus" },
            },
            {
                path: "cab",
                canActivate: [AuthGuard],
                component: CabMisDownloadComponent,
                data: { extraParameter: "misDownloadsMenus" },
            },
            {
                path: "cms",
                canActivate: [AuthGuard],
                component: CmsMisDownloadsComponent,
                data: { extraParameter: "misDownloadsMenus" },
            }
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MISDownloadRoutingModule { }
