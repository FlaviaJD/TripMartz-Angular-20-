import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripidRoutingModule } from './tripid-routing.module';
import { CreateTripidComponent } from './component/create-tripid/create-tripid.component';
import { TripidListComponent } from './component/tripid-list/tripid-list.component';
import { LayoutsModule } from '../../layout/layout.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthGuard } from '../../auth/auth.guard';
@NgModule({
  declarations: [CreateTripidComponent, TripidListComponent],
  imports: [
    CommonModule,
    LayoutsModule, 
    BsDatepickerModule.forRoot(),
    TripidRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [
    AuthGuard
  ]
})
export class TripidModule {
    constructor(){
    }
 }
