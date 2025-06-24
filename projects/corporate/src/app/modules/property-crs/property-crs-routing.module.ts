import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { AddPropertyComponent } from "./components/add-property/add-property.component";
import { PropertyListComponent } from "./components/property-list/property-list.component";
import { HotelInfoComponent } from "./components/hotel-info/hotel-info.component";
import { SeasonManagementComponent } from "./components/season-management/season-management.component";
import { SeasonListComponent } from "./components/season-management/season-list/season-list.component";
import { PropertyImageComponent } from "./components/property-image/property-image.component";
import { AddRoomComponent } from "./components/room-mangement";
import { RoomListComponent } from "./components/room-mangement";
import { AddSeasonComponent } from "./components/room-mangement";
import { PriceManagementComponent } from "./components/room-mangement";
import { PropertyTypeComponent } from "./components/property-type/property-type.component";
import { BoardTypeComponent } from "./components/board-type/board-type.component";
import { RoomTypeComponent } from "./components/room-type/room-type.component";
import { PropertyAmenitiesComponent } from "./components/property-amenities/property-amenities.component";
import { RoomAmenitiesComponent } from "./components/room-amenities/room-amenities.component";
import { RoomMealTypeComponent } from "./components/room-meal-type/room-meal-type.component";
import { SupplierComponent } from "./components/supplier/supplier.component";
import { SupplierViewPropertyComponent } from "./components/supplier/supplier-view-property/supplier-view-property.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "add-property",
        canActivate: [AuthGuard],
        component: AddPropertyComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path: "property-list",
        canActivate: [AuthGuard],
        component: PropertyListComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path: "hotel",
        canActivate: [AuthGuard],
        component: HotelInfoComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path: "image",
        canActivate: [AuthGuard],
        component: PropertyImageComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'add-season',
        canActivate:[AuthGuard],
        component:SeasonManagementComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'season-list',
        canActivate:[AuthGuard],
        component:SeasonListComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'add-room',
        canActivate:[AuthGuard],
        component:AddRoomComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'room-list',
        canActivate:[AuthGuard],
        component:RoomListComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'room-add-season',
        canActivate:[AuthGuard],
        component:AddSeasonComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'price-management',
        canActivate:[AuthGuard],
        component:PriceManagementComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'property-type',
        canActivate:[AuthGuard],
        component:PropertyTypeComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'room-type',
        canActivate:[AuthGuard],
        component:RoomTypeComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'board-type',
        canActivate:[AuthGuard],
        component:BoardTypeComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'property-amenities',
        canActivate:[AuthGuard],
        component:PropertyAmenitiesComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'room-amenities',
        canActivate:[AuthGuard],
        component:RoomAmenitiesComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'room-meal-type',
        canActivate:[AuthGuard],
        component:RoomMealTypeComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'supplier-list',
        canActivate:[AuthGuard],
        component:SupplierComponent,
        data: { extraParameter: "propertyMenus" },
      },
      {
        path:'view-property',
        canActivate:[AuthGuard],
        component:SupplierViewPropertyComponent,
        data: { extraParameter: "propertyMenus" },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PropertyRoutingModule { }
