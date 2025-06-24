import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from '../../../../../../app/core/api-handlers';
import { SwalService } from '../../../../../../app/core/services/swal.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SupportedExtensions } from 'ngx-export-as';
import { BusService } from '../../bus.service';
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
  loggedInUser: any;
  razorpay_payment_id: any;
  order_id: any;
  isCashFree: boolean;

  constructor(
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
    private cdRef: ChangeDetectorRef,
    private swalService: SwalService,
    private busService :BusService

  ) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(localStorage.getItem("studentCurrentUser"));
    this.route.queryParams.subscribe(params => {
      this.appReference = params.appReference;
      this.booking_source=params.booking_source;
      if(params['OrderId']){
        this.isCashFree=false;
        this.order_id = params['OrderId'] ? (params['OrderId']).replace("/", "") : "";
        this.razorpay_payment_id=params['paymentId'] ? (params['paymentId']).replace("/", "") : "";
      }
      if (params['order_id']) {
        this.appReference = localStorage.getItem("app_reference");
        this.booking_source = localStorage.getItem("booking_source");
        this.isCashFree=true;
        this.order_id = params['order_id'] ? (params['order_id']).replace("/", "") : "";
      }
    })
    if (this.razorpay_payment_id) {
      this.checkPaymentStatus();
    }
    if (this.isCashFree) {
      this.checkCashifyPaymentGateway();
    }
    this.getVoucherData();
  }


  checkPaymentStatus() {
    this.loading=true;
    let req = {
        app_reference: this.appReference,
        order_id: this.order_id,
        txnId:this.razorpay_payment_id,
        userId:this.loggedInUser.id
    }
    this.apiHandlerService.apiHandler('razorpayTransactionStatus', 'post', {}, {},
        req).subscribe(resp => {
            this.loading=false;
            if (resp.statusCode == 200 && resp.data && resp.data.isPaymentSuccess) {
                this.reservation();
            } else {
                this.loading=false;
                this.swalService.alert.oops(resp.msg);
            }
        }, err => {
            this.loading=false;
            this.swalService.alert.oops(err.error.Message);
        })
}

checkCashifyPaymentGateway() {
  this.loading=true;
  let req = {
      app_reference: this.appReference,
      order_id: this.order_id,
      userId:this.loggedInUser.id
  }
  this.apiHandlerService.apiHandler('cashfreeTransactionStatus', 'post', {}, {},
      req).subscribe(resp => {
          this.loading=false;
          if (resp.statusCode == 200 && resp.data && resp.data.isSuccess) {
              this.reservation();
          } else {
              this.loading=false;
              this.swalService.alert.oops(resp.msg);
          }
      }, err => {
          this.loading=false;
          this.swalService.alert.oops(err.error.Message);
      })
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

  reservation() {
    this.loading=true;
    let request = {
        "AppReference": this.appReference,
        "booking_source":this.booking_source
    }
    this.apiHandlerService.apiHandler('bookSeats', 'post', '', '', request).subscribe(response => {
        if (response.statusCode == 200 && response.data) {
            this.busService.busConfirmationData.next(response.data);
            this.swalService.alert.success("Your transaction is successful.")
            this.loading = false;
            this.getVoucherData();
        }
        else {
          this.loading = false;
          this.swalService.alert.oops(response.msg);
        }
    }, (err) => {
      this.loading=false;
        this.swalService.alert.oops(err.error.Message);
        
    });
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
