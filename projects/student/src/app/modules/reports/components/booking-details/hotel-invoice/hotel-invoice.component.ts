import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import html2canvas from 'html2canvas';
import { SubSink } from 'subsink';
import jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { ReportService } from '../../../reports.service';

@Component({
    selector: 'app-hotel-invoice',
    templateUrl: './hotel-invoice.component.html',
    styleUrls: ['./hotel-invoice.component.scss']
})
export class HotelInvoiceComponent implements OnInit {
    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    loading: boolean = false;
    leadPaxDetails:any;
    app_reference: "";
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'print_voucher',
        options: {
            jsPDF: {
                orientation: 'portrait'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private reportService:ReportService
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
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

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.voucherData.BookingDetails.AppReference;
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

    getB2cHotelVoucher() {
        this.loading = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelVoucher', 'post', {}, {},
            {
                "AppReference": this.app_reference,
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

    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }

    getTime(t) {
        return t.split(" ")[1];
    }

    displayMaskContact(str) {
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

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}

