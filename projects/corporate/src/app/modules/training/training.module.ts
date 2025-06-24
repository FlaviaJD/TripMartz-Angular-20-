import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingRoutingModule } from './training-routing.module';
import { TrainingListComponent } from './components/training-list/training-list.component';
import { LayoutsModule } from '../../layout/layout.module';
import { AddTrainingNameComponent } from './add-training-name/add-training-name.component';
import { AddTrainerNameComponent } from './add-trainer-name/add-trainer-name.component';
import { AddTrainerVenueComponent } from './add-trainer-venue/add-trainer-venue.component';
import { CreateUpdateTrainingNameComponent } from './add-training-name/components/create-update-training-name/create-update-training-name.component';
import { TrainingNameListComponent } from './add-training-name/components/training-name-list/training-name-list.component';
import { CreateUpdateTrainerNameComponent } from './add-trainer-name/components/create-update-trainer-name/create-update-trainer-name.component';
import { TrainerNameListComponent } from './add-trainer-name/components/trainer-name-list/trainer-name-list.component';
import { CreateUpdateTrainingVenueComponent } from './add-trainer-venue/components/create-update-training-venue/create-update-training-venue.component';
import { TrainingVenueListComponent } from './add-trainer-venue/components/training-venue-list/training-venue-list.component';
import { PartcipantsListComponent } from './components/partcipants-list/partcipants-list.component';

@NgModule({
  declarations: [TrainingListComponent, AddTrainingNameComponent, AddTrainerNameComponent, AddTrainerVenueComponent, CreateUpdateTrainingNameComponent, TrainingNameListComponent, CreateUpdateTrainerNameComponent, TrainerNameListComponent, CreateUpdateTrainingVenueComponent, TrainingVenueListComponent, PartcipantsListComponent],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    LayoutsModule
  ]
})
export class TrainingModule { }
