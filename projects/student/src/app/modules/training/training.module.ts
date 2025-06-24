import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainingRoutingModule } from './training-routing.module';
import { CreateTrainingComponent } from './components/create-training/create-training.component';
import { TrainingListComponent } from './components/training-list/training-list.component';
import { LayoutsModule } from '../../layout/layout.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  declarations: [CreateTrainingComponent, TrainingListComponent],
  imports: [
    CommonModule,
    FormsModule,
    LayoutsModule,
    TrainingRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TrainingModule { }
