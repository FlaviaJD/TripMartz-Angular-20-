import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherRoutingModule } from './other-routing.module';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [AllNotificationComponent],
  imports: [
    CommonModule,
    OtherRoutingModule,
    SharedModule,
  ]
})
export class OtherModule { }
