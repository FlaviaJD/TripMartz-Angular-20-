import { NgModule } from '@angular/core';
import { MarkupRoutingModule } from './markup-routing.module';
import { SharedModule } from '../../shared/shared.module';
import {
    AgentsComponent,
    CorporateFlightComponent,
    CorporateHotelComponent,
    AgentCarComponent,
} from './components';
import { CorporateMarkUpListComponent } from './components/corporate-flight/corporate-mark-up-list/corporate-mark-up-list.component';
import { AgentMarkupDetailComponent } from './components/corporate-flight/corporate-markup-detail/corporate-markup-detail.component';
import { CorporateMarkupAddUpdateComponent } from './components/corporate-flight/corporate-markup-add-update/corporate-markup-add-update.component';

@NgModule({
    imports: [
        SharedModule,
        MarkupRoutingModule
    ],
    declarations: [
        AgentsComponent,
        CorporateFlightComponent,
        CorporateHotelComponent,
        AgentCarComponent,
        CorporateMarkUpListComponent,
        AgentMarkupDetailComponent,
        CorporateMarkupAddUpdateComponent,

    ]
})
export class MarkupModule { }
