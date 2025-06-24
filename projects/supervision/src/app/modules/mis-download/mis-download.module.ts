import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { LayoutsModule } from "../../layout/layout.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { FlightMisDownloadsComponent } from "./components/flight-mis-download/flight-mis-download.component";
import { TrainMisDownloadComponent } from "./components/train-mis-download/train-mis-download.component";
import { BusMisDownloadComponent } from "./components/bus-mis-download/bus-mis-download.component";
import { CabMisDownloadComponent } from "./components/cab-mis-download/cab-mis-download.component";
import { MISDownloadRoutingModule } from "./mis-download-routing.module";
import { HotelMisDownloadComponent } from "./components/hotel-mis-download/hotel-mis-download.component";
import { CmsMisDownloadsComponent } from './components/cms-mis-downloads/cms-mis-downloads.component';

@NgModule({
    declarations: [
        FlightMisDownloadsComponent,
        HotelMisDownloadComponent,
        TrainMisDownloadComponent,
        BusMisDownloadComponent,
        CabMisDownloadComponent,
        CmsMisDownloadsComponent
    ],
    imports: [
        CommonModule,
        MISDownloadRoutingModule,
        SharedModule,
        LayoutsModule,
        Ng2SearchPipeModule,
        NgMultiSelectDropDownModule.forRoot(),
    ],
})
export class MISDownloadModule { }
