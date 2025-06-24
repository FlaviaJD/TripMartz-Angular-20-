import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {  ExportAsConfig, SupportedExtensions  } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';

@Component({
  selector: 'app-booking-train-invoice',
  templateUrl: './booking-train-invoice.component.html',
  styleUrls: ['./booking-train-invoice.component.scss']
})
export class BookingTrainInvoiceComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    loading: boolean = false;
    app_reference: "";
    voucherData: any;
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
        private activatedRoute: ActivatedRoute,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        this.getTrainVoucher();
    }


    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    getTrainVoucher() {
        this.loading = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('trainVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.voucherData = resp.data[0] || [];
                    this.loading = false;
                }
                else {
                    this.loading = false;
                    this.swalService.alert.error(resp.msg || '');
                }
            }, err => {
                this.loading = false;
            });
    }

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName =this.voucherData['TrainDetails']['AppReference'];
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

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }
}
