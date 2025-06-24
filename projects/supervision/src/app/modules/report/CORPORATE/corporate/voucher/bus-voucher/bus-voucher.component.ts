import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

@Component({
  selector: 'app-bus-voucher',
  templateUrl: './bus-voucher.component.html',
  styleUrls: ['./bus-voucher.component.scss']
})
export class BusVoucherComponent implements OnInit {

    appReference: any = "";
    voucherResponse: any = [];
    loading: boolean;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    booking_source: any;
  logInUser: any;
  manageDomainData: any;
  
    constructor(
      private route: ActivatedRoute,
      private apiHandlerService: ApiHandlerService,
      private cdRef: ChangeDetectorRef,
      private swalService: SwalService
  
    ) { }
  
    ngOnInit(): void {
      this.logInUser = JSON.parse(localStorage.getItem("currentSupervisionUser"));
      this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
      .subscribe(resp => {
        if (resp.statusCode == 200 || resp.statusCode == 201) {
          this.manageDomainData = resp.data[0].domain_logo;
        }
      });

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
          this.cdRef.detectChanges();
        }
      },
        (err) => {
          this.loading = false;
          this.cdRef.detectChanges();
          this.swalService.alert.oops(err.error.Message);
        });
    }
    getFormtedStatus(status: string) {
      if (status != null) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
      }
    }
  
  
}
