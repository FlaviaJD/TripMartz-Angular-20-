import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  ExportAsConfig, SupportedExtensions  } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportService } from '../../../report.service';

@Component({
  selector: 'app-booking-car-invoice',
  templateUrl: './booking-car-invoice.component.html',
  styleUrls: ['./booking-car-invoice.component.scss']
})
export class BookingCarInvoiceComponent implements OnInit {

    private subSunk = new SubSink();
    loading: boolean = false;
    app_reference: "";
    voucherData: any;

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
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bCarVoucher', 'post', {}, {},
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

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

}
