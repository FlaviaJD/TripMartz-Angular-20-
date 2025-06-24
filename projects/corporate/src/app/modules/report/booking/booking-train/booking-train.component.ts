import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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

const log = new Logger('report/BookingTrainComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-booking-train',
  templateUrl: './booking-train.component.html',
  styleUrls: ['./booking-train.component.scss']
})
export class BookingTrainComponent implements OnInit {

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
    respDataCopy: any;
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
        { key: 'request_ID', value: 'Application Reference' },
        { key: 'invoice_no', value: 'Invoice No' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'Status', value: 'Booking Status' },
        { key: 'app_status', value: 'Approvar Status' },
        { key: 'pnr', value: 'PNR' },
        { key: 'corporate', value: 'Corporate Name' },
        { key: 'passenger_name', value: 'Passenger Name' },
        { key: 'Phone', value: 'Phone' },
        { key: 'email', value: 'Email' },
        { key: 'train_Date', value: 'Travel Date' },
        { key: 'bookedBy', value: 'Booked By' },
        { key: 'train_From', value: 'Train From' },
        { key: 'train_To', value: 'Train To' },
        { key: 'quote', value: 'Fare Quota' },
        { key: 'train_Class', value: 'Class' },
        { key: 'trainName', value: 'Train Name' },
        { key: 'trainNo', value: 'Train No' },
        { key: 'totalFare', value: 'Total Fare' },
        { key: 'admin_cancellation_ts', value: 'Admin Cancellation Date' },
        { key: 'cancellation_charge', value: 'Cancellation Charge' },
        { key: 'cancelled_by_id', value: 'Cancelled By' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal : boolean;
    showCancelModal : boolean;
    showPaymentModal : boolean;
    currentRecord : any = [];
    paxDetails : any = [{
        "Title" : "",
        "FirstName" : "",
        "LastName" : "",
    }];
    srcUrl: string = "";
    confirmedData: any;
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private exportAsService: ExportAsService,
        private router: Router,
        private reportService:ReportService,
        private cdr: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        let fromDate=this.utility.setFromDate();
        let tommorow=this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            train_app_reference: new FormControl('', [Validators.maxLength(120)]),
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
       
        this.getTrainReport();
    }

    onSearchSubmit() {
       this.getTrainReport();
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
       this.getTrainReport();
    }
    

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    getStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1] + ' ' + tmpStatus[2]}`
    }

  
    getTrainReport() {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
         reqBody = {
            "Status": this.regConfig.get('status').value,
                "ReservationCode":this.regConfig.get('train_app_reference').value,
                "BookedFromDate":this.regConfig.get('booked_from_date').value? formatDate(this.regConfig.get('booked_from_date').value, 'YYYY-MM-DD') : "",
                "BookedToDate": this.regConfig.get('booked_to_date').value? formatDate(this.regConfig.get('booked_to_date').value, 'YYYY-MM-DD') : "", 
        }
        this.apiHandlerService.apiHandler('trainById', 'POST', '', '', reqBody).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data && res.data.length > 0) {
                this.respData = res.data;
                this.respDataCopy = res.data;
                this.collectionSize = this.respData.length;
                this.noData = false;
                this.cdr.detectChanges();
            }
            else {
                this.respData = [];
                this.collectionSize = this.respData.length;
                this.noData = false;
                this.cdr.detectChanges();
            }
        }, (err) => {
            this.respData = [];
            this.collectionSize = this.respData.length;
            this.noData = false;
            this.cdr.detectChanges();
        });
    }
    
    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = this.respDataCopy.slice().filter((objData, index) => {
            const status = this.getFormtedStatus(objData.TrainDetails.BookingStatus);
            const filterOnFields = {
                request_ID: objData.TrainDetails.AppReference,
                invoice_no:objData.TrainDetails.XlproInvoiceNo,
                status: status,
                app_status: status,
                pnr: objData.TrainDetails.PNR,
                passenger_name: objData.PaxDetails[0].FirstName + ' ' + objData.PaxDetails[0].LastName,
                phone: objData.PaxDetails[0].MobileNo,
                email: objData.PaxDetails[0].Email,
                corporate: '',
                trip_id:objData.TrainDetails.TripId,
                trip_name:objData.TrainDetails.TripName,
                quote: objData.PaxDetails[0].Quote,
                train_Date: moment(objData.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                bookedBy: '',
                train_From: objData.TrainDetails.From,
                train_To: objData.TrainDetails.To,
                train_Class: objData.TrainDetails.PreferredClass,
                trainName: objData.TrainDetails.TrainName,
                trainNo: objData.TrainDetails.TrainNumber,
                totalFare: objData.TrainDetails.TotalFare,
                admin_cancellation_ts:objData.TrainDetails.CancelConfirmationDate,
                cancellation_charge:objData.TrainDetails.CancellationCharges,
                cancelled_by_id:objData.TrainDetails.CancelledById,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...this.respDataCopy];
            
    }

    sortedData = this.respData.slice();
    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'request_ID': return this.utility.compare('' + a.TrainDetails.AppReference, '' + b.TrainDetails.AppReference, isAsc);
                case 'status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'invoice_no': return this.utility.compare(+ a.TrainDetails.XlproInvoiceNo, + b.TrainDetails.XlproInvoiceNo, isAsc);
                case 'app_status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'pnr': return this.utility.compare('' + a.TrainDetails.PNR, '' + b.TrainDetails.PNR, isAsc);
                case 'passenger_name': return this.utility.compare('' + a.PaxDetails[0].FirstName, '' + b.PaxDetails[0].LastName, isAsc);
                case 'phone': return this.utility.compare('' + a.PaxDetails[0].MobileNo, '' + b.PaxDetails[0].MobileNo, isAsc);
                case 'email': return this.utility.compare('' + a.PaxDetails[0].Email, '' + b.PaxDetails[0].Email, isAsc);
                case 'quote': return this.utility.compare('' + a.TrainDetails.Quote, '' + b.TrainDetails.Quote, isAsc);
                case 'train_Date': return this.utility.compare(+ a.TrainDetails.OnwardDate, + b.TrainDetails.OnwardDate, isAsc);
                case 'bookedBy': return this.utility.compare('' + a.TrainDetails.From, '' + b.TrainDetails.From, isAsc);
                case 'train_From': return this.utility.compare('' + a.TrainDetails.From, '' + b.TrainDetails.From, isAsc);
                case 'train_To': return this.utility.compare('' + a.TrainDetails.To, '' + b.TrainDetails.To, isAsc);
                case 'train_Class': return this.utility.compare(+ a.TrainDetails.PreferredClass, + b.TrainDetails.PreferredClass, isAsc);
                case 'trainName': return this.utility.compare(+ a.TrainDetails.TrainName, + b.TrainDetails.TrainName, isAsc);
                case 'trainNo': return this.utility.compare(+ a.TrainDetails.TrainNumber, + b.TrainDetails.TrainNumber, isAsc);
                case 'totalFare': return this.utility.compare(+ a.TrainDetails.TotalFare, + b.TrainDetails.TotalFare, isAsc);
                case 'train_time': return this.utility.compare(+ a.TrainDetails.OnwardTime, + b.TrainDetails.OnwardTime, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.TrainDetails.CancelConfirmationDate, + b.TrainDetails.CancelConfirmationDate, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.TrainDetails.CancellationCharges, + b.TrainDetails.CancellationCharges, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.TrainDetails.CancelledById, + b.TrainDetails.CancelledById, isAsc);
                case 'trip_id': return this.utility.compare(+ a.TrainDetails.TripId, + b.TrainDetails.TripId, isAsc);
                case 'trip_name': return this.utility.compare(+ a.TrainDetails.TripName, + b.TrainDetails.TripName, isAsc);
                default: return 0;
            }

            const aValue = (a as any)[sort.active];
            const bValue = (b as any)[sort.active];
            return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
    }


    download(type: SupportedExtensions, orientation?: string) {
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
            this.respDataCopy = [...this.respData];
            this.collectionSize = this.respDataCopy.length;
        } else {
            this.getTrainReport();
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

    submitTicket(data) {
        this.swalService.alert.confirm(paymentType => {
            switch (paymentType) {
                case 'nagad':
                    data['paymentType'] = 'nagad';
                    this.nagadPayment(data);
                    break;
                case 'bKash':
                    this.srcUrl = `${b2b_url}/paymentGateway/${data.AppReference}?source=reports`
                    window.location.replace(this.srcUrl);
                    break;
                case 'wallet':
                    this.walletPayment(data);
                    break;

                default:
                    break;
            }
        });
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

    walletPayment(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('checkWalletBalance', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res && res.data[0].ticketFare) {
                if (res.data[0].ticketFare > res.data[0].userWalletBalance) {
                    this.swalService.alert.oops("Your wallet balence is low.")
                } else {
                    this.callPnrTicket(data);
                }
            }
            else{
                this.swalService.alert.oops(res.msg);
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    callPnrTicket(data) {
        let TicketData = {
            AppReference: data.AppReference,
            booking_source: data.ApiCode,
            payment_type:'wallet'
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData).subscribe(res => {
            if (res) {
                this.confirmedData = res.data.FinalBooking.BookingDetails;
                if (this.confirmedData.BookingStatus.toUpperCase() === "BOOKING_CONFIRMED") {
                    this.deductFromWallet(data);
                }
                else {
                    this.swalService.alert.oops("Sorry unable to process your request. Please contact reservation.");
                    this.router.navigate(['/']);
                }
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    deductFromWallet(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('deductFromWallet', 'post', '', '', { app_reference: data.AppReference }).subscribe(res => {
            if (res) {
                this.swalService.alert.success("Sucess Your Booking is Confirmed.");
                this.router.navigate(['/report/b2b/voucher/flight'], { queryParams: { appReference: data.AppReference } });
            }
            else{
                this.swalService.alert.oops(res.msg);
            }
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    cancelTicket() {
        let data = this.cancelData;
        this.showConfirm = false;
        this.load = true;  

        let reqBody = {
            "AppReference": data.AppReference,
            "booking_source": data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('cancelFlightBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket cancelled sucessfully");
                this.load = false;  
                this.getTrainReport();
            }
        }, err => {
            this.load = false;  
            this.swalService.alert.oops(err.error.Message);
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
  
    voidTicketPopup(data) {
        this.subjectName = 'Void';
        this.showConfirm = true;
        this.cancelData = data;
    }

    voidTicket() {
        this.showConfirm = false;
        this.load = true;  
        let data = this.cancelData;
        let reqBody = {
            "AppReference": data.AppReference,
            "booking_source": data.ApiCode
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('voidFlightBooking', 'post', '', '', reqBody).subscribe(res => {
            if (res && res.data) {
                this.swalService.alert.success("Ticket voided sucessfully");
                this.load = false;  
                this.getTrainReport();
            }
        }, err => {
            this.swalService.alert.oops(err.error.Message);
            this.load = false;  
        });
    }

    findLeaduserDetails(data){
        if(data){
           let leadUser = data.filter(x => x.is_lead == 1);
           return `${leadUser[0]['title'] || ''}. ${leadUser[0].first_name} ${leadUser[0]['middle_name'] || ''} ${leadUser[0].last_name}`;
        }
    }
    
    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any,index:number) => {
               let status;
                if (response.TrainDetails.BookingStatus == 'BOOKING_ADMIN_REJECTED' || response.TrainDetails.BookingStatus == 'BOOKING_EMPLOYEE_REJECTED') {
                     status = this.getStatus(response.TrainDetails.BookingStatus);
                } else {
                     status = this.getFormtedStatus(response.TrainDetails.BookingStatus);
                }
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.TrainDetails.AppReference,
                    "Invoice No":response.TrainDetails.XlproInvoiceNo,
                    "TripId":response.TrainDetails.TripId || 'N/A',
                    "Trip Name":response.TrainDetails.TripName || 'N/A',
                    "Booking Status": status,
                    'Approvar Status':response.TrainDetails.ApprovalStatus || 'PENDING',
                    "PNR": response.TrainDetails.PNR || 'N/A',
                    "Corporate Name":response.CorporateName,
                    "Passenger Name": response.PaxDetails[0].FirstName + ' ' + response.PaxDetails[0].LastName,
                    "Phone": response.PaxDetails[0].MobileNo || 'N/A',
                    "Email": response.PaxDetails[0].Email,
                    "Booked By": response.BookedByName,
                    "Travel Date": moment(response.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                    "Train From": response.TrainDetails.From,
                    "Train To": response.TrainDetails.To,
                    "Fare Quota": response.TrainDetails.Quote || 'N/A',
                    "Class": response.TrainDetails.PreferredClass,
                    "Train Name": response.TrainDetails.TrainName,
                    "Train No": response.TrainDetails.TrainNumber,
                    "Total Fare": response.TrainDetails.TotalFare,
                    "Admin Cancellation Date":response.TrainDetails.CancelConfirmationDate ? moment(response.TrainDetails.CancelConfirmationDate).format("MMM DD, YYYY"):'N/A',
                    "Cancellation Charge":response.TrainDetails.CancellationCharges || 'N/A',
                    "Cancelled By":response.TrainDetails.CancelledById || 'N/A',
                }
            });
     
            const columnWidths = [
                { wch: 5 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 40 },
                { wch: 15 },
                { wch: 30 },
                { wch: 30 },
                { wch: 15 },
                { wch: 15 },
                { wch: 30 },
                { wch: 10 },
                { wch: 10 },
                { wch: 10 },
                { wch: 15},
                { wch: 15},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 25},
                { wch: 15},
                { wch: 15},
                { wch: 15},
            ];

            this.utility.exportToExcel(
                fileToExport,
                'Train Report',
                columnWidths
            );
        }
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
