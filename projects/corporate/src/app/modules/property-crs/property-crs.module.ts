import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { LayoutsModule } from "../../layout/layout.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { PropertyRoutingModule } from "./property-crs-routing.module";
import { AddPropertyComponent } from "./components/add-property/add-property.component";
import { PropertyListComponent } from "./components/property-list/property-list.component";
import { HotelInfoComponent } from "./components/hotel-info/hotel-info.component";
import { SeasonManagementComponent } from "./components/season-management/season-management.component";
import { SeasonListComponent } from "./components/season-management/season-list/season-list.component";
import { PropertyImageComponent } from './components/property-image/property-image.component';
import { AddRoomComponent } from './components/room-mangement/add-room/add-room.component';
import { RoomListComponent } from './components/room-mangement/room-list/room-list.component';
import { AddSeasonComponent } from './components/room-mangement/add-season/add-season.component';
import { PriceManagementComponent } from './components/room-mangement/price-management/price-management.component';
import { PropertyTypeComponent } from './components/property-type/property-type.component';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { BoardTypeComponent } from './components/board-type/board-type.component';
import { PropertyAmenitiesComponent } from './components/property-amenities/property-amenities.component';
import { RoomAmenitiesComponent } from './components/room-amenities/room-amenities.component';
import { RoomMealTypeComponent } from './components/room-meal-type/room-meal-type.component';
import { AddPropertyTypeComponent } from './components/property-type/add-property-type/add-property-type.component';
import { PropertyTypeListComponent } from './components/property-type/property-type-list/property-type-list.component';
import { RoomTypeListComponent } from './components/room-type/room-type-list/room-type-list.component';
import { AddRoomTypeComponent } from './components/room-type/add-room-type/add-room-type.component';
import { BoardTypeListComponent } from './components/board-type/board-type-list/board-type-list.component';
import { AddBoardTypeComponent } from './components/board-type/add-board-type/add-board-type.component';
import { PropertyAmenitiesListComponent } from './components/property-amenities/property-amenities-list/property-amenities-list.component';
import { AddPropertyAmenitiesComponent } from './components/property-amenities/add-property-amenities/add-property-amenities.component';
import { RoomAmenitiesListComponent } from './components/room-amenities/room-amenities-list/room-amenities-list.component';
import { AddRoomAmenitiesComponent } from './components/room-amenities/add-room-amenities/add-room-amenities.component';
import { RoomMealTypeListComponent } from './components/room-meal-type/room-meal-type-list/room-meal-type-list.component';
import { AddRoomMealTypeComponent } from './components/room-meal-type/add-room-meal-type/add-room-meal-type.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { SupplierListComponent } from './components/supplier/supplier-list/supplier-list.component';
import { AddUpdateSupplierComponent } from './components/supplier/add-update-supplier/add-update-supplier.component';
import { SupplierViewPropertyComponent } from './components/supplier/supplier-view-property/supplier-view-property.component';

@NgModule({
    declarations: [
        AddPropertyComponent,
        PropertyListComponent,
        HotelInfoComponent,
        SeasonManagementComponent,
        SeasonListComponent,
        PropertyImageComponent,
        AddRoomComponent,
        RoomListComponent,
        AddSeasonComponent,
        PriceManagementComponent,
        PropertyTypeComponent,
        RoomTypeComponent,
        BoardTypeComponent,
        PropertyAmenitiesComponent,
        RoomAmenitiesComponent,
        RoomMealTypeComponent,
        AddPropertyTypeComponent,
        PropertyTypeListComponent,
        RoomTypeListComponent,
        AddRoomTypeComponent,
        BoardTypeListComponent,
        AddBoardTypeComponent,
        PropertyAmenitiesListComponent,
        AddPropertyAmenitiesComponent,
        RoomAmenitiesListComponent,
        AddRoomAmenitiesComponent,
        RoomMealTypeListComponent,
        AddRoomMealTypeComponent,
        SupplierComponent,
        SupplierListComponent,
        AddUpdateSupplierComponent,
        SupplierViewPropertyComponent
    ],
    imports: [
      CommonModule,
      PropertyRoutingModule,
      SharedModule,
      LayoutsModule,
      Ng2SearchPipeModule,
      NgMultiSelectDropDownModule.forRoot(),
    ],
  })
  export class PropertyModule {}
  