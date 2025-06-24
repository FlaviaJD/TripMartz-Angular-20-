import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { HotelAmenitiesComponent } from './components/hotel-amenities/hotel-amenities.component';
import { HotelTypeComponent } from './components/hotel-type/hotel-type.component';
import { RoomAmenitiesComponent } from './components/room-amenities/room-amenities.component';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { HotelDetailComponent } from './components/hotels/components/hotel-detail/hotel-detail.component';

const routes: Routes = [
    {
        path: 'hotels',
        component: BaseLayoutComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'hotel-types',
                component: HotelTypeComponent,
                data: { extraParameter: 'hotelCrsMenus' }
            },
            {
                path: 'room-types',
                component: RoomTypeComponent,
                data: { extraParameter: 'hotelCrsMenus' }
            },
            {
                path: 'hotel-amenities',
                component: HotelAmenitiesComponent,
                data: { extraParameter: 'hotelCrsMenus' }
            },
            {
                path: 'room-amenities',
                component: RoomAmenitiesComponent,
                data: { extraParameter: 'hotelCrsMenus' }
            },
            {
                path: 'hotel-crs-list',
                component: HotelsComponent,
                data: { extraParameter: 'hotelCrsMenus' }
            },
            {
                path: 'view-hotel/:hotel_id',
                component: HotelDetailComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HotelCrsRoutingModule { }