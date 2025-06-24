import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  FlightComponent,
  BusComponent,
  HotelComponent,
  TransfersComponent,
  ActivitesComponent
} from './components';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { MarkupComponent } from './markup.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: MarkupComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'flight',
        component: FlightComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'bus',
        component: BusComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'hotel',
        component: HotelComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'transfers',
        component: TransfersComponent,
        data: {extraParameter: 'markupMenus'}
      },
      {
        path: 'activities',
        component: ActivitesComponent,
        data: {extraParameter: 'markupMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkupRoutingModule { }
