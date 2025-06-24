import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SupportedExtensions } from 'ngx-export-as';

@Component({
  selector: 'app-booking-bus-voucher',
  templateUrl: './booking-bus-voucher.component.html',
  styleUrls: ['./booking-bus-voucher.component.scss']
})
export class BookingBusVoucherComponent implements OnInit {
    voucherResponse: any = [];
    appReference: any = "";
    loading: boolean;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    booking_source: any;
    logInUser: any;
    constructor(
        private route: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private cdRef: ChangeDetectorRef,
        private swalService: SwalService
      ) { }
      
    ngOnInit(): void {
      this.logInUser = JSON.parse(localStorage.getItem("currentCorpUser"));
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
    
      public downloadPDF(isWithPrice: boolean) {
        window.scroll(0, 0);
        var data = document.getElementById('print_voucher');
        const date = new Date().toDateString();
        setTimeout(() => {
          html2canvas(data, {
            allowTaint: true,
            useCORS: true
          }).then(canvas => {
            const contentDataURL = canvas.toDataURL('image/png', 1.0)
            let pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(contentDataURL);
            var width = pdf.internal.pageSize.getWidth() - 3;
            var height = (imgProps.height * width) / imgProps.width;
            pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height);
            this.swalService.alert.success("Downloaded Successfully.");
            pdf.save(`${this.voucherResponse['BookingDetails']['app_reference']}- ${this.voucherResponse['BookingDetails']['ticket']} -${date}.pdf`);
          });
        }, 1000)
      }
    
    
      downloadA4(type: SupportedExtensions, orientation?: string): void {
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
          orientation: 'p',
          unit: 'pt',
          format: 'a4',
        });
        const content = document.getElementById('print_voucher');
    
        doc.html(content, {
          html2canvas: {
            allowTaint: true,
            useCORS: true,
            scale: 600 / content.scrollWidth
          },
          callback: async (doc) => {
            doc.save(`${this.voucherResponse['BookingDetails']['app_reference']}- ${this.voucherResponse['BookingDetails']['ticket']} -${date}.pdf`);
            this.swalService.alert.success("Downloaded Successfully.");
            document.getElementById('download').style.display = "inline-block";
            document.getElementById('ticket').style.display = "inline-block";
          }
        });
    
      }
}
