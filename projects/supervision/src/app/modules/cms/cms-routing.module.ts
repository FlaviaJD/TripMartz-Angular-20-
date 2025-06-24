import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightTopDestinationsComponent } from './components/flight-top-destinations/flight-top-destinations.component';
import { MainBannerImageComponent } from './components/main-banner-image/main-banner-image.component';
import { StaticPageContentComponent } from './components/static-page-content/static-page-content.component';
import { AgentLoginAlertComponent } from './components/agent-login-alert/agent-login-alert.component';
import { AirlineHotelPartnersComponent } from './components/airline-hotel-partners/airline-hotel-partners.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { AuthGuard } from '../../auth/auth.guard';
import { AgentMainBannerImageComponent } from './components/agent-main-banner-image/agent-main-banner-image.component';
import { AgentStaticPageContentComponent } from './components/agent-static-page-content/agent-static-page-content.component';

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
        path: 'agents-login-alert',
        canActivate: [AuthGuard],
        component: AgentLoginAlertComponent,
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
      },
      {
        path: 'agent-main-banner-image',
        canActivate: [AuthGuard],
        component: AgentMainBannerImageComponent,
        data: {extraParameter: 'cmsMenus'}
      },
      {
        path: 'agent-static-page-content',
        canActivate: [AuthGuard],
        component:AgentStaticPageContentComponent ,
        data: {extraParameter: 'cmsMenus'}
      },

      {
        path: 'airline-hotel-partner',
        canActivate: [AuthGuard],
        component: AirlineHotelPartnersComponent,
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
