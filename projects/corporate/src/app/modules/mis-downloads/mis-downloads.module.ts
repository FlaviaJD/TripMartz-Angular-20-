import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { LayoutsModule } from "../../layout/layout.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { MISDownloadsRoutingModule } from "./mis-downloads-routing.module";
import { FlightMisDownloadsComponent } from "./components/flight-mis-downloads/flight-mis-downloads.component";
import { HotelMisDownloadsComponent } from "./components/hotel-mis-downloads/hotel-mis-downloads.component";
import { TrainMisDownloadsComponent } from "./components/train-mis-downloads/train-mis-downloads.component";
import { BusMisDownloadsComponent } from "./components/bus-mis-downloads/bus-mis-downloads.component";
import { CabMisDownloadsComponent } from "./components/cab-mis-downloads/cab-mis-downloads.component";

@NgModule({
    declarations: [
        FlightMisDownloadsComponent,
        HotelMisDownloadsComponent,
        TrainMisDownloadsComponent,
        BusMisDownloadsComponent,
        CabMisDownloadsComponent
    ],
    imports: [
      CommonModule,
      MISDownloadsRoutingModule,
      SharedModule,
      LayoutsModule,
      Ng2SearchPipeModule,
      NgMultiSelectDropDownModule.forRoot(),
    ],
  })
  export class MISDownloadsModule {}
  