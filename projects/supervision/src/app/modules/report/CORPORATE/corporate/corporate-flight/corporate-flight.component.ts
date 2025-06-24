import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import { formatDate } from 'ngx-bootstrap/chronos';
import { environment } from 'projects/supervision/src/environments/environment.prod';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { ReportService } from '../../../report.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { HttpErrorResponse } from '@angular/common/http';

const b2b_url = `${environment.b2b_url}/b2b`

const log = new Logger('report/CorporateFlightComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-corporate-flight',
    templateUrl: './corporate-flight.component.html',
    styleUrls: ['./corporate-flight.component.scss']
})
export class CorporateFlightComponent implements OnInit, OnDestroy {

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
    filteredCorp: Observable<string[]>;
    corporateList: Array<any> = []; 
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
        { key: 'app_reference', value: 'Application Reference' },
        { key: 'trip_id', value:'Trip Id'},
        { key: 'trip_name',value:'Trip Name'},
        { key: 'trip_type',value:'Trip Type'},
        { key: 'status', value: 'Status' },
        { key: 'app_status', value: 'Approvar Status' },
        { key: 'app_name', value: 'Approvar Name' },
        { key: 'corporate_name', value: 'Corporate Name' },
        // { key: 'fare_type', value: 'Fare Type' },
        { key: "supplier", value: 'Supplier' },
        { key: 'gds_pnr', value: 'GDS PNR' },
        { key: 'airline_pnr', value: 'Airline PNR' },
        { key: 'fare', value: 'Fare' },
        { key: 'tax', value: 'Tax' },
        { key: 'commision', value: 'Commision' },
        { key: 'markup', value: 'Markup' },
        { key: 'convenience_fee', value: 'Convenience Fee' },
        { key: 'discount', value: 'Discount' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'payment_mode', value: 'Payment Mode' },
        { key: 'booked_by', value: 'Booked By' },
        { key: 'booked_on', value: 'Booked On' }
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal: boolean;
    showCancelModal: boolean;
    showPaymentModal: boolean;
    currentRecord: any = [];
    paxDetails: any = [];
    srcUrl: string = "";
    confirmedData: any;
    corporateId: string='';
    loggedInUser: any;
 
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private exportAsService: ExportAsService,
        private router: Router,
        private reportService:ReportService
    ) { }

    ngOnInit() {
        this.getClientList();
        let fromDate = this.utility.setFromDate();
        let tommorow = this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            pnr: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
            corporate: new FormControl('', [Validators.maxLength(120)]),
        });
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow,
        }, { emitEvent: false });
        this.setCorporate();
        this.getB2bFlightReport();
    }

    getClientList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.CORPORATE_AUTH_ROLE_ID })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.corporateList = resp.data || [];
                    this.setCorporate();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
    }

    setCorporate() {
        this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter(option => (option.business_name + ' (' + option.uuid + ')').toLowerCase().includes(filterValue));
    }

    onSearchSubmit() {
        this.getB2bFlightReport();
    }

    onReset() {
        this.corporateId='';
        let fromDate = this.utility.setFromDate();
        let tommorow = this.utility.setToDate();
        this.regConfig.reset();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: fromDate,
            booked_to_date: tommorow,
        });
        this.searchText = '';
        this.getB2bFlightReport();
    }
    
    getB2bFlightReport() {
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
                "corporate_id":this.corporateId,
                "auth_role_id":7

            }
        } else {
            reqBody = {}
        }

        this.subSunk.sink = this.apiHandlerService.apiHandler('b2bFlightReport', 'post', {}, {}, reqBody)
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
                this.noData = false;
                this.respData = [];
            });
    }

    onValueChange(value){
        if(value==''){
            this.corporateId='';
        }
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
                remarks: objData.remarks,
                trip_id:objData.TripId,
                trip_name:objData.TripName

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

    sortedData = this.respData.slice();
    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'app_reference': return this.utility.compare('' + a.AppReference, '' + b.AppReference, isAsc);
                case 'status': return this.utility.compare('' + a.BookingStatus, '' + b.BookingStatus, isAsc);
                case 'trip_id': return this.utility.compare('' + a.TripId, '' + b.TripId, isAsc);
                case 'trip_name': return this.utility.compare('' + a.TripName, '' + b.TripName, isAsc);
                case 'trip_type': return this.utility.compare('' + a.TripName, '' + b.TripName, isAsc);
                case 'app_status': return this.utility.compare('' + a.approvarStatus, '' + b.approvarStatus, isAsc);
                case 'corporate_name': return this.utility.compare('' + a.corporateName, '' + b.corporateName, isAsc);
                case 'fare_type': return this.utility.compare(+a.TotalFarePriceBreakUp.PriceBreakup.FareType[0], +b.TotalFarePriceBreakUp.PriceBreakup.FareType[0], isAsc);
                case 'supplier': return this.utility.compare('' + a.DomainOrigin, '' + b.DomainOrigin, isAsc);
                case 'booked_by': return this.utility.compare('' + a.booked_by, '' + b.booked_by, isAsc);
                case 'gds_pnr': return this.utility.compare('' + a.GDS_PNR, '' + b.GDS_PNR, isAsc);
                case 'airline_pnr': return this.utility.compare('' + a.FlightItineraries[0].airline_pnr, '' + b.FlightItineraries[0].airline_pnr, isAsc);
                case 'fare': return this.utility.compare('' + a.TotalFarePriceBreakUp.PriceBreakup.BasicFare, '' + b.TotalFarePriceBreakUp.PriceBreakup.BasicFare, isAsc);
                case 'tax': return this.utility.compare('' + a.TotalFarePriceBreakUp.PriceBreakup.Tax, '' + b.TotalFarePriceBreakUp.PriceBreakup.Tax, isAsc);
                case 'markup': return this.utility.compare('' + a.AgentMarkup, '' + b.AgentMarkup, isAsc);
                case 'commision': return this.utility.compare('' + a.AgentCommission, '' + b.remarks.AgentCommission, isAsc);
                case 'convenience_fee': return this.utility.compare('' + a.ConvinenceAmount, '' + b.ConvinenceAmount, isAsc);
                case 'discount': return this.utility.compare('' + a.Discount, '' + b.Discount, isAsc);
                case 'total_fare': return this.utility.compare('' + a.TotalFare, '' + b.TotalFare, isAsc);
                case 'payment_mode': return this.utility.compare('' + a.PaymentMode, '' + b.PaymentMode, isAsc);
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
            this.getB2bFlightReport();
        }
    }

    showPaxProfile(data) {
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.Passengers
    }

    hide() {
        this.showModal = false;
        this.showCancelModal = false;
        this.showPaymentModal = false;
        this.showConfirm = false;
    }

    showPaymentInfo(data) {
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
        let invoiceNumber = this.reportService.setInvoiceNumber(data.AppReference);
        this.subSunk.sink = this.apiHandlerService.apiHandler('executePayment', 'post', {}, {}, {
            app_reference: data.AppReference,
            order_id: `FBPI${date.substr(10)}${date.substr(0, 7)}${date.substr(7)}`,
            payment_type: data.paymentType,
            merchantInvoiceNumber: invoiceNumber,
            source: 'reports'
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
        }, (err => {
            this.swalService.alert.oops(err.error.Message)
        }));
    }

    callPnrTicket(data) {
        let TicketData = {
            AppReference: data.AppReference,
            booking_source: data.ApiCode,
            payment_type: 'wallet'
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
                this.swalService.alert.success("Thank you for ticketing with TripMartz.");
                this.router.navigate(['/report/voucher/flight'], { queryParams: { appReference: data.AppReference } });
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
                this.getB2bFlightReport();
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
                this.getB2bFlightReport();
            }
        }, err => {
            this.swalService.alert.oops(err.error.Message);
            this.load = false;
        });
    }

    findLeaduserDetails(data) {
        if (data) {
            let leadUser = data.filter(x => x.is_lead == 1);
            return `${leadUser[0]['title'] || ''}. ${leadUser[0].first_name} ${leadUser[0]['middle_name'] || ''} ${leadUser[0].last_name}`;
        }
    }

    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any, index: number) => {
                let basicFare=0;
                let tax=0;
                if(response && response.TotalFarePriceBreakUp && response.TotalFarePriceBreakUp.PriceBreakup && response.TotalFarePriceBreakUp.PriceBreakup.BasicFare)
                {
                    basicFare=response.TotalFarePriceBreakUp.PriceBreakup.BasicFare
                }
                if(response && response.TotalFarePriceBreakUp && response.TotalFarePriceBreakUp.PriceBreakup && response.TotalFarePriceBreakUp.PriceBreakup.Tax)
                    {
                        tax=response.TotalFarePriceBreakUp.PriceBreakup.Tax
                    }
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.AppReference,
                    "Trip Id":response.TripId || 'N/A',
                    "Trip Name":response.TripName || 'N/A',
                    "Trip Type":response.TripType || 'N/A',
                    "Status": this.getFormtedStatus(response.BookingStatus),
                    "Approvar Status":response.approvarStatus,
                    "Approvar Name":response.approvarName,
                    "Corporate Name":response.corporateName || 'N/A',
                   // "Fare Type":response.TotalFarePriceBreakUp.PriceBreakup.FareType[0],
                    "Supplier": response.DomainOrigin,
                    "GDS PNR": response['GDS_PNR'] || 'N/A',
                    "Airline PNR": response['FlightItineraries'][0]['flightBookingTransactionItineraries'][0]['airline_pnr'],
                    "Fare":basicFare,
                    "Tax":tax,
                    "Commision":response.AgentCommission,
                    "Markup":response.AgentMarkup,
                    "Convenience Fee":response.ConvinenceAmount,
                    "Discount":response.Discount,
                    "Total Fare":response.TotalFare,
                    "Payment Mode": response.PaymentMode,
                    "Booked By": response.booked_by,
                    "Booked On":moment(response.CreatedDatetime).format("DD MMM YYYY")
                }
            });

            const columnWidths = [
                { wch: 5 }
            ];
            const fieldsLength = this.respData.length;
            for (let i = 0; i < fieldsLength; i++) {
                columnWidths.push({ wch: 30 })
            }
            this.loggedInUser = JSON.parse(localStorage.getItem('currentSupervisionUser'));
            let value = this.loggedInUser.auth_role_id == 1 ? "Admin" : 'Staff'
            this.utility.exportToExcel(
                fileToExport,
                value + '-Flight Report',
                columnWidths
            );
        }
    }
    
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onSelectionChanged(event) {
        this.corporateId= event.option.id;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
