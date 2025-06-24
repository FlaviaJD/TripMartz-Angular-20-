import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorModule } from 'ckeditor4-angular';
import { LayoutsModule } from '../../layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { CmsRoutingModule } from './cms-routing.module';
import { FlightTopDestinationsComponent } from './components/flight-top-destinations/flight-top-destinations.component';
import { AddUpdateSliderTextComponent } from './components/main-banner-image/components/add-update-slider-text/add-update-slider-text.component';
import { AddUpdateSliderComponent } from './components/main-banner-image/components/add-update-slider/add-update-slider.component';
import { SliderImageListComponent } from './components/main-banner-image/components/slider-image-list/slider-image-list.component';
import { SliderTextListComponent } from './components/main-banner-image/components/slider-text-list/slider-text-list.component';
import { MainBannerImageComponent } from './components/main-banner-image/main-banner-image.component';
import { AddUpdateContentComponent } from './components/static-page-content/components/add-update-content/add-update-content.component';
import { ListContentComponent } from './components/static-page-content/components/list-content/list-content.component';
import { StaticPageContentComponent } from './components/static-page-content/static-page-content.component';

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
        ListContentComponent
       
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
