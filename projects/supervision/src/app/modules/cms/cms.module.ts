import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { LayoutsModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { CmsRoutingModule } from './cms-routing.module';
import { AgentLoginAlertComponent } from './components/agent-login-alert/agent-login-alert.component';
import { AirlineHotelPartnersComponent } from './components/airline-hotel-partners/airline-hotel-partners.component';
import { AddUpdateAirlinePartnerComponent } from './components/airline-hotel-partners/components/add-update-airline-partner/add-update-airline-partner.component';
import { HotelPartersListComponent } from './components/airline-hotel-partners/components/hotel-parters-list/hotel-parters-list.component';
import { ListAirlinePartnerComponent } from './components/airline-hotel-partners/components/list-airline-partner/list-airline-partner.component';
import { FlightTopDestinationsComponent } from './components/flight-top-destinations/flight-top-destinations.component';
import { AddUpdateSliderTextComponent } from './components/main-banner-image/components/add-update-slider-text/add-update-slider-text.component';
import { AddUpdateSliderComponent } from './components/main-banner-image/components/add-update-slider/add-update-slider.component';
import { SliderImageListComponent } from './components/main-banner-image/components/slider-image-list/slider-image-list.component';
import { SliderTextListComponent } from './components/main-banner-image/components/slider-text-list/slider-text-list.component';
import { MainBannerImageComponent } from './components/main-banner-image/main-banner-image.component';
import { AddUpdateContentComponent } from './components/static-page-content/components/add-update-content/add-update-content.component';
import { ListContentComponent } from './components/static-page-content/components/list-content/list-content.component';
import { StaticPageContentComponent } from './components/static-page-content/static-page-content.component';
import { AgentMainBannerImageComponent } from './components/agent-main-banner-image/agent-main-banner-image.component';
import { AgentAddUpdateSliderComponent } from './components/agent-main-banner-image/components/agent-add-update-slider/agent-add-update-slider.component';
import { AgentSliderImageListComponent } from './components/agent-main-banner-image/components/agent-slider-image-list/agent-slider-image-list.component';
import { AgentAddUpdateSliderTextComponent } from './components/agent-main-banner-image/components/agent-add-update-slider-text/agent-add-update-slider-text.component';
import { AgentSliderTextListComponent } from './components/agent-main-banner-image/components/agent-slider-text-list/agent-slider-text-list.component';
import { AgentStaticPageContentComponent } from './components/agent-static-page-content/agent-static-page-content.component';
import { AgentAddUpdateContentComponent } from './components/agent-static-page-content/components/agent-add-update-content/agent-add-update-content.component';
import { AgentListContentComponent } from './components/agent-static-page-content/components/agent-list-content/agent-list-content.component';

@NgModule({
    declarations: [
        FlightTopDestinationsComponent,
        MainBannerImageComponent,
        StaticPageContentComponent,
        SliderImageListComponent,
        AddUpdateSliderComponent,
        AddUpdateContentComponent,
        AddUpdateSliderTextComponent,
        SliderTextListComponent,
        ListContentComponent,
        AgentLoginAlertComponent,
        AirlineHotelPartnersComponent,
        AddUpdateAirlinePartnerComponent,
        ListAirlinePartnerComponent,
        HotelPartersListComponent,
        AgentMainBannerImageComponent,
        AgentAddUpdateSliderComponent,
        AgentSliderImageListComponent,
        AgentAddUpdateSliderTextComponent,
        AgentSliderTextListComponent,
        AgentStaticPageContentComponent,
        AgentAddUpdateContentComponent,
        AgentListContentComponent,
        
    ],
    imports: [
        CommonModule,
        CmsRoutingModule,
        CKEditorModule,
        SharedModule,
        LayoutsModule,
    ]
})
export class CmsModule { }
