import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SwalService } from '../../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../../core/services/utility.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
    selector: 'app-hotel-voucher',
    templateUrl: './hotel-voucher.component.html',
    styleUrls: ['./hotel-voucher.component.scss']
})
export class HotelVoucherComponent implements OnInit {
    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    noOfAdults: number = 0;
    noOfChilds: number = 0;
    loading: boolean = false;
    isDcbBooking:boolean=false;
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
    manageDomainData: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        this.subSunk.sink = this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {}, {})
        .subscribe(resp => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.manageDomainData = resp.data[0].domain_logo;
          }
        });
        this.getHotelVoucher();
    }

    getHotelVoucher() {
        this.loading=true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cHotelVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.loading=false;
                    this.voucherData = resp.data || [];
                    this.voucherData['BookingPaxDetails'].forEach((element, i) => {
                        if (i < this.voucherData['BookingPaxDetails'].length) {
                            if (element['PaxType'] == 'Child') {
                                this.noOfChilds++;
                            } else if (element['PaxType'] == 'Adult') {
                                this.noOfAdults++;
                            }
                        }
                    });
                }
                else {
                    this.loading=false;
                    this.swalService.alert.error(resp.msg || '');
                }
            }, err => {
                this.loading=false;
            });
    }

    cancelBooking() {

    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }

    getRoomType(roomName: string): string {
        roomName = roomName.split('-')[0].trim();
        return `${roomName}`;
    }

    getCancelationPolicy(cancellationPolicy) {
        if (cancellationPolicy && cancellationPolicy.length>0 &&  cancellationPolicy[0].CancelPenalty) {
            const penalty = cancellationPolicy[0].CancelPenalty;
            return penalty;
        }
        else {
            return "No Cancellation Policy Found";
        }
    }
    
    getHotelPhoto(imgArrStr) {
        if (imgArrStr != null) {
            return imgArrStr[0];
        } else {
            return '';
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
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


    getTotalAmount() {
        let totalAmnt: number = 0;
        this.voucherData['BookingItineraryDetails'].forEach(o => {
            totalAmnt += o.RoomPrice;
        });
        return totalAmnt;
    }

    getTotalTax() {
        let total = this.getTotalAmount();
        return this.voucherData.BookingDetails.TotalFair - total;
    }


    ngOnDestroy(): void {
        this.subSunk.unsubscribe();

    }
}
