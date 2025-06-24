import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { CreateTripidComponent } from './component/create-tripid/create-tripid.component';
import { TripidListComponent } from './component/tripid-list/tripid-list.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'create-tripid',
        component: CreateTripidComponent,
        data: { extraParameter: 'TripIdMenus' }
      },
      {
        path: 'tripid-list',
        component: TripidListComponent,
        data: { extraParameter: 'TripIdMenus' }
      },
      { path: '', redirectTo: 'tripid-list', pathMatch: 'full' }, // Default route
      { path: '**', redirectTo: 'tripid-list' } // Handle 404s or unknown routes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripidRoutingModule { }
