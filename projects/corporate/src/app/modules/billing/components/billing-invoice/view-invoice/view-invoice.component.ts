import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  ExportAsConfig, SupportedExtensions  } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    invoiceData:any;
    isDownloadTrue:boolean=false;
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
    tableHeader=[{"key":"noAmt","value":'Ticket No.'},
                {"key":"noAmt","value":'Pax Name'},
                {"key":"noAmt","value":'Sector'},
                {"key":"noAmt","value":'Flight Details'}, 
                {"key":"amt","value":'Base Fare'},
                {"key":"amt","value":'Tax & Chrg'},
                {"key":"amt","value":'Total Fare'}]
    dummyData={
        "invoiceDetails":{
         'name':'Richard Robario',
         'place':'Gujarat',
         'state':'Gujarat',
         'pinCode':400703,
         'stateCode':24,
         'inVoiceNo':"DW 8662",
         'referenceNo':"VH-6786-2357-3262",
         'invoiceDate':"12-06-2023"
        },
        "pax":[{
         'ticketNo':"AI-987897",
         'paxName':'Richard',
         'sector':"BLR - GT",
         'flightDetails':"Air India, Boarding: 11:05AM",
         'baseFare':78776,
         'tax':1321,
         'totalFare':80097,
         'currency':"INR"
         },
         {	
         'ticketNo':"AI-987897",
         'paxName':'Sam',
         'sector':"BLR - GT",
         'flightDetails':"Air India, Boarding: 11:05AM",
         'baseFare':10000,
         'tax':2000,
         'totalFare':12000,
         'currency':"INR"
         },
         ],
         "termCondition":{
             cash:"Payment to be made to the cashier & printed official receipt must be obtained",
             cheque:"All cheques/demands drafts in payment of bills must be crossed 'A/C Payee' only and drawan in the favour of 'Tripmartz.'",
             latePayment:"Interest @24% per annum will be charged on all outstanding bills after due date",
             veryImp:"Kindlt check all the details carefully to avoid un-necessary complication"
         }
     }

  constructor( private swalService:SwalService,
                private activatedRoute:ActivatedRoute
  ) { }

  ngOnInit() {
    this.getInvoiceData();
    this.activatedRoute.queryParams.subscribe(res=>{
        if(res.action =='download'){
           this.isDownloadTrue=true;
        }
    })
  }
  getInvoiceData(){
    this.invoiceData=this.dummyData
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
    let fileName = this.invoiceData['invoiceDetails']['inVoiceNo']
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

}
