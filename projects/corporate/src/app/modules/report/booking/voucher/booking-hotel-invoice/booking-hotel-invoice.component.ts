import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
// import { ApiHandlerService } from '../../../../../../core/api-handlers';
// import { SwalService } from '../../../../../../core/services/swal.service';
// import { UtilityService } from '../../../../../../core/services/utility.service';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';

import { SubSink } from 'subsink';
import { ReportService } from '../../../report.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-booking-hotel-invoice',
  templateUrl: './booking-hotel-invoice.component.html',
  styleUrls: ['./booking-hotel-invoice.component.scss']
})
export class BookingHotelInvoiceComponent implements OnInit {
    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
	private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData : any;
    app_reference : "";
    loading: boolean = false;
    leadPaxDetails:any;
    paxUser : any = {
    	Address: "",
		Address2: "",
		Email: "",
		FirstName: "",
		LastName: "",
		LeadPax: "",
		PhoneNumber: "",
		PostalCode: "",
		Title: ""
    };

    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'print_voucher',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };

  constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute : ActivatedRoute,
        private reportService:ReportService
    ) { }

  ngOnInit() {
  	this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.app_reference =(queryParams['appReference']);  
    });
  	this.getB2cHotelVoucher();
  }

  pdfCallbackFn(pdf: any) {
    // example to add page number as footer to every page of pdf
    const noOfPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= noOfPages; i++) {
        pdf.setPage(i);
        pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
    }
}

  getB2cHotelVoucher() {
    this.loading = true;
    this.subSunk.sink = this.apiHandlerService.apiHandler('b2cHotelVoucher', 'post', {}, {},
        {
            "app_reference": this.app_reference,
        })
        .subscribe(resp => {
            if (resp.statusCode == 200 || resp.statusCode == 201) {
                this.loading = false;
                this.voucherData = resp.data || [];
                this.leadPaxDetails=this.reportService.getLeaduserDetails(this.voucherData.BookingPaxDetails);
            }
            else {
                this.loading = false;
                this.swalService.alert.error(resp.msg || '');
            }
        }, err => {
            this.loading = false;
        });
}

  calculateDiff(fromDate,toDate){
        return this.utility.calculateDiff(fromDate,toDate);
    }

    getTime(t){
    	return t.split(" ")[1];
    }

    cancelBooking(){

    }

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => {
            return x.LeadPax == true
        });
           this.paxUser = leadUser[0];
        }
    }

    displayMaskContact(str){
    	return str.replace(/\d(?=\d{4})/g, "*");
    }

    getTotalAmount() {
        let totalAmnt: number = 0;
        if (this.voucherData) {
            this.voucherData['BookingItineraryDetails'].forEach(o => {
                totalAmnt += o.RoomPrice;
            });
        }
        return totalAmnt;
    }

    getTotalTax() {
        let totalTax: number = 0;
        if (this.voucherData) {
            this.voucherData['BookingItineraryDetails'].forEach(o => {
                totalTax += (+(o.Tax));
            });
        }
        return totalTax;
    }

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.voucherData['BookingDetails']['AppReference'];
        window['html2canvas'] = html2canvas;
        const date = new Date().toDateString();
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4',
        });

        const content = this.print_voucher.nativeElement;

        doc.html(content, {
            html2canvas: {
                allowTaint: true,
                useCORS: true,
                scale: 600 / content.scrollWidth
            },

            callback: async (doc) => {
                doc.save(`${fileName}.pdf`);
                this.swalService.alert.success();

            }
        });

    }

  ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
