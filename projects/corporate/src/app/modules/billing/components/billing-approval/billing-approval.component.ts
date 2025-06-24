import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';

const log=new Logger('billing/approval')

@Component({
  selector: 'app-billing-approval',
  templateUrl: './billing-approval.component.html',
  styleUrls: ['./billing-approval.component.scss']
})
export class BillingApprovalComponent implements OnInit {

    pageSize = 6;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "appReferenceNo", value: 'App Reference No' },
        { key: "invoiceNo", value: 'Invoice No' },
        { key: "view", value: 'View' },
        { key: "download", value: 'Download' },
    ];

    noData: boolean = false;
    fetchingData:boolean=true
    respData: any;
    status;
    dummyData=[
        {"appReferenceNo":"VH-UH-323","invoiceNo":"DW 1231"},
        {"appReferenceNo":"VH-UH-223","invoiceNo":"DW 2231"},
        {"appReferenceNo":"VH-UH-523","invoiceNo":"DW 3321"},
        {"appReferenceNo":"VH-UH-343","invoiceNo":"DW 4221"},
        {"appReferenceNo":"VH-UH-543","invoiceNo":"DW 5111"},
        {"appReferenceNo":"VH-UH-873","invoiceNo":"DW 4341"},
    ]
    constructor(
    ) { }

    ngOnInit() {
        this.getInvoiceList();
    }

    getInvoiceList(): void {
        setTimeout(() => {
            this.respData=this.dummyData;
            this.fetchingData=false;
            this.collectionSize = this.respData.length;
        }, 2000);
    }

    onView(val) {
        log.debug('On view button clicked');
    }

    onDownload(data:any){
        log.debug('On download button clicked');
    }

    sortData(sort: Sort) {
        
    }

}
