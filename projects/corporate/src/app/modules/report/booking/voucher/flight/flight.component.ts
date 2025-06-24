import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { environment } from 'projects/corporate/src/environments/environment.prod';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
const baseUrlBarCode= environment.b2c_url;
const baseUrl = environment.image_url;
@Component({
    selector: 'app-flight',
    templateUrl: './flight.component.html',
    styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit {

    @ViewChild('print_voucher', { static: false }) print_voucher: ElementRef;
    private subSunk = new SubSink();
    isOpen = false as boolean;
    voucherData: any;
    app_reference: "";
    airline_logo = baseUrl+'/airline_logo/'; //AI.svg
    domainInformation: any;

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
    loadingTemplate: any;
    loading: boolean=false;
    segment_indicator0:any;
    segment_indicator1:any;
    isSeatInfoNotEmpty:any=false;
    passengersDetails:any=[];
    logInUser: any;
    barCodeUrl = baseUrlBarCode+'/webservice/flight/flightBarCodes/';
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    toggleStyle: boolean = true;
    public buttonName:any = 'Hide Price';
  toggle(){
    this.toggleStyle = !this.toggleStyle;

    if(this.toggleStyle)  
    this.buttonName = "Hide Price";
  else
    this.buttonName = "Show Price";
}

onPrint(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print_voucher').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}

    ngOnInit() {
        this.logInUser = JSON.parse(localStorage.getItem("currentCorpUser"));
        this.subSunk.sink = this.activatedRoute.queryParams.subscribe(queryParams => {
            this.app_reference = (queryParams['appReference']);
        });
        this.getB2cHotelVoucher();
        this.getDomain();
    }

    getB2cHotelVoucher() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightVoucher', 'post', {}, {},
            {
                "app_reference": this.app_reference,
            })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.generatePassengerData(resp);
                    for(let flightTransaction of resp.data[0].FlightBookingTransaction){
                        flightTransaction.flightBookingTransactionItineraries.forEach((element, i) => {
                          if (element.attributes) {
                                let attributes = element.attributes.replace(/\"/gi, "\"");
                                element.attributes = JSON.parse(attributes);
                            }
                        });
                    }
                    this.voucherData = resp.data[0] || [];
                    let flightItineraries:any=this.filterUniqueZBAPINO00003Source(this.voucherData);
                    const combinedFlights = [].concat(...flightItineraries);
                    this.voucherData.FlightBookingTransaction= combinedFlights.sort((a, b) => a.segment_indicator - b.segment_indicator);
                   // this.enableSeat();
                    //this.setPNRData(this.voucherData);
                    
                }
                else {
                    this.swalService.alert.error(resp.msg || '');
                }
                
            });
    }

    generatePassengerData(resp) {
        if (resp && resp.data && resp.data.length > 0) {
            let data = resp.data[0];
            this.passengersDetails= [];
            data.FlightBookingTransaction.forEach((flightTransaction) => {
                flightTransaction.flightBookingTransactionPassengers.forEach((passenger, index) => {
                    if (!this.passengersDetails[index]) {
                        this.passengersDetails[index] = [];
                    }
                    if (passenger.attributes) {
                        let attributes = JSON.parse(passenger.attributes.replace(/\'/gi, "\""));
                            passenger['barcode'] = attributes.barcodeUrl;
                            
                    }
                    this.passengersDetails[index].push(passenger);
                });
            });
        }
    }

    filterUniqueZBAPINO00003Source(data) {
        let foundZBAPINO00003 = false;
        const FlightItineraries = [];
        data.FlightBookingTransaction.forEach((element: any) => {
        //     if (element.source === "ZBAPINO00003" && !foundZBAPINO00003) {
        //         foundZBAPINO00003 = true;
        //         FlightItineraries.push(element.flightBookingTransactionItineraries);
        //     } else if (element.source === "ZBAPINO00019" || element.source === "ZBAPINO00020") {
                FlightItineraries.push(element.flightBookingTransactionItineraries);
           // }
        });
        return FlightItineraries;
    }


    calculateDiff(fromDate, toDate) {
        return this.utility.calculateDiff(fromDate, toDate);
    }
    calculateDiffTime(fromDate, toDate) {
        return this.utility.calculateDiffTime(fromDate, toDate);
    }
    getTime(t) {
        return t.split(" ")[1];
    }

    cancelBooking() {

    }

    findLeaduserDetails(data) {
        if (data) {
            let leadUser = data.filter(x => {
                return x.LeadPax == true
            });
            return `${leadUser[0].Title} ${leadUser[0].FirstName} ${leadUser[0].LastName}`;
        }
    }

    getDomain() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('manageDomain', 'post', {}, {},
            {})
            .subscribe(resp => {
                if (resp.statusCode == 201 && resp.data) {
                    this.domainInformation = resp.data[0];

                }
            }, (err) => {
            })
    }

    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `voucher_${this.app_reference}`).subscribe((_) => {
            // save started
            this.swalService.alert.success();
        }, (err) => {
            this.swalService.alert.oops();
        });
    }

    downloadA4(type: SupportedExtensions, orientation?: string): void {
        let fileName = this.voucherData['AppReference']
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
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 10);
        }
    }

    getBaggage(val) {
        if (val) {
            let bg = val.split(" ");
            if (bg.length > 1 && bg[1] != "undefined" && parseInt(bg[0]) > 0)
                return bg[0] + ' ' +
                    ((bg[1] == 'Kilograms' || bg[1] == 'Kg' || bg[1] == 'KGS') ? 'KG' : bg[1]);
            else
                return bg[0] + ' ' + 'KG';
        } else if (val === '') {
            return '0 KG';
        }
    }

    duration(f) {
        const origin = f.departure_datetime;
        const destination = f.arrival_datetime
        const startDate = new Date(origin);
        // Do your operations
        const endDate = new Date(destination);
        const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        return hours + ' hr ' + (minutes - (hours * 60)) + ' min';

    }

    getFormtedStatus(status: string) {
        if (status != null) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`;
        }
    }

    getTimeFromDate(date: any) {
        return date.substr(11, 5);
    }
    
    importPNR() {
        this.loading=true;
        this.apiHandlerService.apiHandler('importPnr', 'POST', '', '', { AppReference: this.app_reference,booking_source: this.voucherData['ApiCode'] })
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.loading=false;
                    window.location.reload();
                }
            }, (err) => {
                if (err) {
                    this.loading=false;
                    this.swalService.alert.oops(err.error.msg);
                }
            });
    }

    setPNRData(voucherData) {
        this.segment_indicator0 = voucherData.FlightItineraries.filter(element => element.segment_indicator == 0);
        this.segment_indicator1 = voucherData.FlightItineraries.filter(element => element.segment_indicator == 1);
    }

    enableSeat() {
        const currentUser = this.utility.readStorage('currentCorpUser', localStorage);
        if (this.voucherData && (this.voucherData.ApiCode == 'ZBAPINO00002' || this.voucherData.ApiCode == 'ZBAPINO00007') && currentUser && currentUser.id == 1400) {
            this.isSeatInfoNotEmpty =this.utility.checkSeatSelection(this.voucherData.Passengers);
        }
    }
    
    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
