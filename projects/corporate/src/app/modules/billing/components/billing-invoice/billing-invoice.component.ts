import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
let filterArray: Array<any> = [];

const log=new Logger('billing/invoice')

@Component({
  selector: 'app-billing-invoice',
  templateUrl: './billing-invoice.component.html',
  styleUrls: ['./billing-invoice.component.scss']
})
export class BillingInvoiceComponent implements OnInit {

    pageSize = 50;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'Sl No.' },
        { key: "appReferenceNo", value: 'Application Reference' },
        { key: "invoiceNo", value: 'Invoice No' },
        { key: "view", value: 'View' },
        { key: "download", value: 'Download' },
    ];

    noData: boolean = false;
    fetchingData:boolean=true
    respData: any;
    status;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getInvoiceList();
    }


    getInvoiceList() {
        const reqBody = {
            "keys": []
        }
        this.apiHandlerService.apiHandler('hotelMisDownloadData', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.respData = res.data;
                this.fetchingData=false;
                this.collectionSize = this.respData.length;
            }
            else {
                this.respData = [];
                this.fetchingData=false;
                this.collectionSize = this.respData.length;
            }
        }, (err) => {
            this.respData = [];
            this.fetchingData=false;
            this.collectionSize = this.respData.length;
        });
    }
    
    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.respData];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'appReferenceNo': return this.utility.compare('' + a.App_Reference, '' + b.App_Reference, isAsc);
                case 'invoiceNo': return this.utility.compare('' + a.InvoiceNo, '' + b.InvoiceNo, isAsc);
                default: return 0;
            }
        });
    }

    onView(val) {
        log.debug('On view button clicked');
    }

    onDownload(data:any){
        log.debug('On download button clicked');
    }
    

}
