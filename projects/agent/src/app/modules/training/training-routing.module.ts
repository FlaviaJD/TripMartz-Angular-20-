import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { CreateTrainingComponent } from './components/create-training/create-training.component';
import { TrainingListComponent } from './components/training-list/training-list.component';


const routes: Routes = [ 
{path: '',
component: BaseLayoutComponent,
data: {extraParameter: 'TrainingMenus'},
children: [
  {
    path: 'create-training',
    component: CreateTrainingComponent,
    data: {extraParameter: 'TrainingMenus'}
},
{
    path: 'training-list',
    component: TrainingListComponent,
    data: {extraParameter: 'TrainingMenus'}
}
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule {
   
 }
