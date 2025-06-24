import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { TrainingListComponent } from './components/training-list/training-list.component';
import { AddTrainingNameComponent } from './add-training-name/add-training-name.component';
import { AddTrainerNameComponent } from './add-trainer-name/add-trainer-name.component';
import { AddTrainerVenueComponent } from './add-trainer-venue/add-trainer-venue.component';
import { PartcipantsListComponent } from './components/partcipants-list/partcipants-list.component';


const routes: Routes = [{
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "training-list",
        canActivate: [AuthGuard],
        component: TrainingListComponent,
        data: { extraParameter: "TrainingMenus" },
      },
      {
        path: "add-training-name",
        canActivate: [AuthGuard],
        component: AddTrainingNameComponent,
        data: { extraParameter: "TrainingMenus" },
      },
      {
        path: "add-trainer-name",
        canActivate: [AuthGuard],
        component: AddTrainerNameComponent,
        data: { extraParameter: "TrainingMenus" },
      },
      {
        path: "add-training-venue",
        canActivate: [AuthGuard],
        component: AddTrainerVenueComponent,
        data: { extraParameter: "TrainingMenus" },
      },

      {
        path: "partcipants-list",
        canActivate: [AuthGuard],
        component: PartcipantsListComponent,
        data: { extraParameter: "TrainingMenus" },
      },
      
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
