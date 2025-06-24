import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AddUpdateHotelAmenityComponent } from './components/hotel-amenities/components/add-update-hotel-amenity/add-update-hotel-amenity.component';
import { HotelAmenityListComponent } from './components/hotel-amenities/components/hotel-amenity-list/hotel-amenity-list.component';
import { HotelAmenitiesComponent } from './components/hotel-amenities/hotel-amenities.component';
import { AddUpdateHotelTypeComponent } from './components/hotel-type/components/add-update-hotel-type/add-update-hotel-type.component';
import { HotelTypeListComponent } from './components/hotel-type/components/hotel-type-list/hotel-type-list.component';
import { HotelTypeComponent } from './components/hotel-type/hotel-type.component';
import { HotelListComponent } from './components/hotels/components/hotel-list/hotel-list.component';
import { AddUpdateRoomAmenityComponent } from './components/room-amenities/components/add-update-room-amenity/add-update-room-amenity.component';
import { RoomAmenityListComponent } from './components/room-amenities/components/room-amenity-list/room-amenity-list.component';
import { RoomAmenitiesComponent } from './components/room-amenities/room-amenities.component';
import { AddUpdateRoomTypeComponent } from './components/room-type/components/add-update-room-type/add-update-room-type.component';
import { RoomTypeListComponent } from './components/room-type/components/room-type-list/room-type-list.component';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { HotelCrsRoutingModule } from './hotel-crs.routing.module';
import { HotelDetailComponent } from './components/hotels/components/hotel-detail/hotel-detail.component';
import { AddUpdateHotelComponent } from './components/hotels/components/add-update-hotel/add-update-hotel.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RoomComponent } from './components/hotels/components/room/room.component';
import { HotelImageComponent } from './components/hotels/components/hotel-image/hotel-image.component';
import { RoomDetailComponent } from './components/hotels/components/room-detail/room-detail.component';
import { RoomImageComponent } from './components/hotels/components/room-image/room-image.component';
import { SeasonComponent } from './components/season/season.component';
import { PriceComponent } from './components/hotels/components/price/price.component';
import { CancellationComponent } from './components/hotels/components/cancellation/cancellation.component';
import { HotelCrsDetailComponent } from './components/hotels/components/hotel-crs-detail/hotel-crs-detail.component';
import { AddUpdateSeasonComponent } from './components/season/component/add-update-season/add-update-season.component';
import { SeasonListComponent } from './components/season/component/season-list/season-list.component';
import { MatSlideToggle } from '@angular/material';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SeasonsComponent } from './components/hotels/components/seasons/seasons.component';
import { PriceManagementComponent } from './components/hotels/components/price-management/price-management.component';


@NgModule({
  imports: [
    CommonModule,
    HotelCrsRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    NgMultiSelectDropDownModule,
  ],
  declarations: [
    HotelTypeComponent, 
    RoomTypeComponent, 
    HotelAmenitiesComponent, 
    RoomAmenitiesComponent, 
    HotelListComponent, 
    HotelTypeListComponent, 
    AddUpdateHotelTypeComponent,
    HotelAmenityListComponent,
    AddUpdateHotelAmenityComponent,
    RoomTypeListComponent,
    AddUpdateRoomTypeComponent,
    RoomAmenityListComponent,
    AddUpdateRoomAmenityComponent,
    HotelDetailComponent,
    AddUpdateHotelComponent,
    HotelsComponent,
    RoomComponent,
    HotelImageComponent,
    RoomDetailComponent,
    RoomImageComponent,
    // SeasonComponent,
    SeasonsComponent,
    PriceComponent,
    PriceManagementComponent,
    CancellationComponent,
    HotelCrsDetailComponent,
    AddUpdateSeasonComponent,
    SeasonListComponent,
    SeasonComponent
  ],
  exports: [
    HotelTypeComponent, 
    RoomTypeComponent, 
    HotelAmenitiesComponent, 
    RoomAmenitiesComponent, 
    HotelListComponent,
    SeasonComponent,
  ]
})
export class HotelCrsModule { }
