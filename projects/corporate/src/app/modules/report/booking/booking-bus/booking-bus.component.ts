import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { environment } from 'projects/corporate/src/environments/environment.prod';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { ReportService } from '../../report.service';
import * as moment from 'moment';

const b2b_url = `${environment.b2b_url}/b2b`

const log = new Logger('report/BookingBusComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-booking-bus',
  templateUrl: './booking-bus.component.html',
  styleUrls: ['./booking-bus.component.scss']
})
export class BookingBusComponent implements OnInit {

    private subSunk = new SubSink();
    searchText:string;
    regConfig: FormGroup;
    isOpen = false as boolean;
    subjectName: string;
    showConfirm: boolean;
    cancelData: any;
    load:boolean=false;
    maxDate=new Date();
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'b2b-flight-data',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };

    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appReference', value: 'Application Reference' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: 'approvar_name', value: 'Approvar Name' },
        { key: 'corporate_name', value: 'Corporate Name' },
        { key: 'departure_date', value: 'Departure Date' },
        { key: 'arrival_date', value: 'Arrival Date' },
        { key: 'departure_from', value: 'Departure From' },
        { key: 'arrival_to', value: 'Arrival To' },
        { key: 'bus_type', value: 'Bus Type' },
        { key: 'operator', value: 'Operator' },
        { key: 'pnr', value: 'PNR' },
        { key: 'ticket', value: 'Ticket' },
        // { key: 'currency', value: 'Currency' },
        { key: 'totalFare', value: 'TotalFare' },
        { key: 'cancellation', value: 'Cancellation Date' },
        { key: 'booked_by', value: 'Booked By' },
        { key: 'created_at', value: 'Booked On' }
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal : boolean;
    showCancelModal : boolean;
    showPaymentModal : boolean;
    currentRecord : any = [];
    paxDetails : any = {
        "Title" : "",
        "FirstName" : "",
        "LastName" : "",
    };
    srcUrl: string = "";
    confirmedData: any;
    status: any;
    deleteData: any;
    loading: boolean;
    loadingTemplate: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private exportAsService: ExportAsService,
        private router: Router,
        private reportService:ReportService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        let fromDate=this.utility.setFromDate();
        let tommorow=this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            pnr: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow,
        }, { emitEvent: false });
       
        this.getBusReport();
    }

    onSearchSubmit() {
        this.getBusReport();
    }


    confirmCancel(data,value){
        this.status=value;
        this.deleteData = data;
        this.showConfirm = true;
    }
    
    onReset() {
        let fromDate=this.utility.setFromDate();
        let tommorow=this.utility.setToDate();
        this.regConfig.reset();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: fromDate,
            booked_to_date: tommorow,
        });
        this.searchText='';
        this.getBusReport();
    }
    
    getBusReport() {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'), //? formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD') : formatDate(fromDate, 'YYYY-MM-DD'),
                "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'), //? formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD') : formatDate(date, 'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "pnr": this.regConfig.value.pnr || "",
                "email": this.regConfig.value.email || "",
                "user_type":'corporate'
            }
        } else {
            reqBody = {}
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('busReport', 'post', {}, {}, reqBody)
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData = [];
                }
            }, (err) => {
                this.noData=false;
                this.respData=[];
            });
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                agent: objData.agent,
                transactiondate: objData.transaction,
                app_refernce: objData.app_refernce,
                transactiontype: objData.transactiontype,
                fare: objData.fare,
                remarks: objData.remarks
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];
            
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
                case 'appReference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'trip_id': return this.utility.compare('' + a.trip_id, '' + b.trip_id, isAsc);
                case 'trip_name': return this.utility.compare('' + a.trip_name, '' + b.trip_name, isAsc);
                case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.approvar_status, '' + b.approvar_status, isAsc);
                case 'departure_date': return this.utility.compare('' + a.itinerary[0].departure_datetime, '' + b.itinerary[0].departure_datetime, isAsc);
                case 'arrival_date': return this.utility.compare('' + a.itinerary[0].arrival_datetime, '' + b.itinerary[0].arrival_datetime, isAsc);
                case 'departure_from': return this.utility.compare('' + a.itinerary[0].departure_from, '' + b.itinerary[0].departure_from, isAsc);
                case 'arrival_to': return this.utility.compare('' + a.itinerary[0].arrival_to, '' + b.itinerary[0].arrival_to, isAsc);
                case 'bus_type': return this.utility.compare('' + a.itinerary[0].bus_type, '' + b.itinerary[0].bus_type, isAsc);
                case 'operator': return this.utility.compare('' + a.itinerary[0].operator, '' + b.itinerary[0].operator, isAsc);
                case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
                case 'ticket': return this.utility.compare('' + a.ticket, '' + b.ticket, isAsc);
                case 'currency': return this.utility.compare('' + a.currency, '' + b.currency, isAsc);
                case 'booked_by ': return this.utility.compare('' + a.booked_by, '' + b.booked_by, isAsc);
                case 'totalFare': return this.utility.compare('' + a.total_fare, '' + b.total_fare, isAsc);
                case 'created_at': return this.utility.compare('' + a.itinerary[0].created_at, '' + b.itinerary[0].created_at, isAsc);
                default: return 0;
            }
        });
    }


    download(type: SupportedExtensions, orientation?: string) {
        // if (type)
        
       
        let filename = this.collectionSize == 1 ? "" : "";

        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, filename).subscribe((_) => {
            // save started
            this.swalService.alert.success();
        }, (err) => {
            this.swalService.alert.oops();

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

    receiveSearchValues($event) {
        let resultData = [];
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                resultData = this.respData.filter(function (a) {
                    return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.fromDate).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.toDate).getTime())
                });
            } else if ($event.transactionId) {
                resultData = this.respData.filter(b => {
                    return b.app_refernce == $event.transactionId;
                })
            }
            this.respData = resultData;
            respDataCopy = [...this.respData];
            this.collectionSize = respDataCopy.length;
        } else {
            this.getBusReport();
        }
    }

    showPaxProfile(data){
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.Passengers
    }

    hide()
    {
      this.showModal = false;
      this.showCancelModal = false;
      this.showPaymentModal = false;
      this.showConfirm = false;
    }

    showPaymentInfo(data){
    	this.showPaymentModal = true;
    	this.currentRecord = data;
    }

    nagadPayment(data) {
        let date = (new Date().getTime()).toString();
        let invoiceNumber= this.reportService.setInvoiceNumber(data.AppReference);
        this.subSunk.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source:'reports'
        }).subscribe(resp => {
            if (resp.statusCode == 201 || resp.statusCode == 200) {
                window.location = resp.data.callBackUrl
            }
        })
    }
   
    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    cancelTicket() {
        this.loading = true;
        this.showConfirm = false;
        let payload={
            booking_source: this.deleteData.booking_source,
            AppReference:this.deleteData.app_reference,
        }
        this.apiHandlerService.apiHandler('buscancel', 'POST', '', '', payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Cancelled successfully!!');
                this.getBusReport();
            }
            else {
                this.loading = false;
                this.swalService.alert.oops(res.Message);
            }
        }, (err) => {
            this.loading = false;
            this.swalService.alert.oops(err.error.Message);
            this.cdr.detectChanges();
        });
    }
    
    checkDate(data) {
        var d1 = new Date();
        var d2 = new Date(data.FlightItineraries[0].created_at);
        if (d1.getDate() === d2.getDate()) {
            return d1.getHours() <= 23;
        }
    }

    checkDateExtend(data: any): boolean {
        function getDateOnly(date: Date): Date {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        const d1 = new Date();
        const d2 = new Date(data.JourneyStart);
        return getDateOnly(d1).getTime() <= getDateOnly(d2).getTime();
    }
  
  

  

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => x.is_lead == 1);
           return `${leadUser[0]['title'] || ''}. ${leadUser[0].first_name} ${leadUser[0]['middle_name'] || ''} ${leadUser[0].last_name}`;
        }
    }
    
    exportExcel(): void {
        if (this.respData && this.respData.length > 0) {
            const fileToExport = this.respData.map((response: any, index: number) => {
                // Check if itinerary exists and has data
                const itinerary = response.itinerary && response.itinerary[0];
                
                const status = this.getFormtedStatus(response.status);
                const departure_datetime = itinerary ? this.convertDatetime(itinerary.departure_datetime) : null;
                const arrival_datetime = itinerary ? this.convertDatetime(itinerary.arrival_datetime) : null;
                const created_at = itinerary ? this.convertDatetime(itinerary.created_at) : null;
                
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.app_reference,
                    "Trip Id": response.trip_id,
                    "Trip Name": response.trip_name,
                    "Booking Status": response.status,
                    "Approvar Status": response.approvar_status || 'PENDING',
                    "Corporate Name":response.company_name,
                    "Departure Date": departure_datetime ? new Date(departure_datetime).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                    "Arrival Date": arrival_datetime ? new Date(arrival_datetime).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                    "Departure From": itinerary ? itinerary.departure_from : '',
                    "Arrival To": itinerary ? itinerary.arrival_to : '',
                    "Bus Type": itinerary ? itinerary.bus_type || 'N/A' : 'N/A',
                    "Operator": itinerary ? itinerary.operator : '',
                    "PNR": response.pnr || 'N/A',
                    "Ticket": response.ticket || 'N/A',
                    // "Currency": response.currency,
                    "TotalFare": response.total_fare,
                    "Cancellation Date": response.cancellationDate,
                    "Booked By": response.booked_by,
                    "Booked On": created_at ? new Date(created_at).toLocaleDateString("en-GB", {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }) : '',
                }
            });
    
            const columnWidths = [
                { wch: 5 }
            ];
            const fieldsLength = this.respData.length;
            for (let i = 0; i < fieldsLength; i++) {
                columnWidths.push({ wch: 30 });
            }
    
            this.utility.exportToExcel(
                fileToExport,
                'Corporate-Bus Report',
                columnWidths
            );
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    convertDatetime(datetime) {
        return  datetime?datetime.replace(/\.$/, '.000Z'):'';
    };

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
