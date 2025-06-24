import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightTopDestinationsComponent } from './components/flight-top-destinations/flight-top-destinations.component';
import { MainBannerImageComponent } from './components/main-banner-image/main-banner-image.component';
import { StaticPageContentComponent } from './components/static-page-content/static-page-content.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'flight-top-destinations',
        component: FlightTopDestinationsComponent,
        data: {extraParameter: 'cmsMenus'}
      },
      {
        path: 'main-banner-image',
        canActivate: [AuthGuard],
        component: MainBannerImageComponent,
        data: {extraParameter: 'cmsMenus'}
      },
      {
        path: 'static-page-content',
        canActivate: [AuthGuard],
        component: StaticPageContentComponent,
        data: {extraParameter: 'cmsMenus'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
