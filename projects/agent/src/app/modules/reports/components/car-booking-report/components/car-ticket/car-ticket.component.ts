import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-car-ticket',
  templateUrl: './car-ticket.component.html',
  styleUrls: ['./car-ticket.component.scss']
})
export class CarTicketComponent implements OnInit {
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
        this.getCarVoucher();
    }

    getCarVoucher() {
        this.loading = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('carVoucher', 'post', {}, {},
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
        let fileName = this.voucherData['AppReference'];
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

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

}
