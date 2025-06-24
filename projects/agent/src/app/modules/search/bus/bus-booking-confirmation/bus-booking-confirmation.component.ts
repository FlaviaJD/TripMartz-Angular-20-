import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers/api-handlers.service';
import { BusService } from '../bus.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bus-booking-confirmation',
  templateUrl: './bus-booking-confirmation.component.html',
  styleUrls: ['./bus-booking-confirmation.component.scss']
})
export class BusBookingConfirmationComponent implements OnInit {
    loading: boolean;
    appReference: any;
    booking_source: any;
    voucherResponse: any;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;

  constructor(
    private busService: BusService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private swalService: SwalService,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {

  this.route.queryParams.subscribe(params => {
    this.appReference = params.appReference;
    this.booking_source=params.booking_source
  })
  this.getVoucherData();
}

getVoucherData() {
  this.loading = true;
  this.apiHandlerService.apiHandler('busVoucher', 'POST', '', '', {
    AppReference: this.appReference,
    booking_source:this.booking_source
  }).subscribe(res => {
    if ((res.statusCode == 200 || res.statusCode == 201) && res.data) {
      this.voucherResponse = res.data;
      this.loading = false
    }
  },
    (err) => {
      this.loading = false;
      this.cdRef.detectChanges();
      this.swalService.alert.oops(err.error.Message);
    });
}

}
