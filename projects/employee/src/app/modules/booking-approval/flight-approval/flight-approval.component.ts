import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ReportService } from '../../reports/reports.service';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from '../../../core/api-handlers';
import { HeaderService } from '../../../shared/components/header/header.service';
import { AuthService } from '../../../auth/auth.service';
import { FlightService } from '../../search/flight/flight.service';
import { formatDate } from 'ngx-bootstrap/chronos';
import { untilDestroyed } from '../../../core/services';
import { Sort } from '@angular/material';
import * as moment from 'moment';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-flight-approval',
    templateUrl: './flight-approval.component.html',
    styleUrls: ['./flight-approval.component.scss']
})
export class FlightApprovalComponent implements OnInit {
    private subSunk = new SubSink();
    srcUrl: string = "";
    airLineName: any;
    public loading = false;
    navigationData: any;
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        // { key: 'book_now', value: 'Booking' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'Status', value: 'Approvar Status' },
        { key: 'leadpax_name', value: 'Request From' },
        { key: 'booked_on', value: 'Requested On' },
        { key: 'JourneyFrom', value: 'From' },
        { key: 'JourneyTo', value: 'To' },
        { key: 'JourneyStart', value: 'Travel Date' },
    ];
    noData: boolean = true;
    respData: any;
    config: ExportAsConfig = {
        type: 'pdf',
        download: false,
        elementIdOrContent: 'b2b-flight-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }
    };
    showPaxDetails: boolean;
    showCancelModal: boolean;
    showPaymentModal: boolean;
    currentRecord: any = [];
    paxDetails: any = [];
    paymentForm: FormGroup;
    submitted: boolean;
    showPaymentDetails: boolean;
    paymentData: any;
    cancelData: any;
    showConfirm: boolean;
    subjectName: string;
    paymentGateways: any;
    confirmedData: any;
    selectedRecord: any;
    flights: any;
    copied:boolean=false;
    constructor(
        private reportsService: ReportService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private apiHandlerService: ApiHandlerService,
        private headerService: HeaderService,
        private fb: FormBuilder,
        private as: AuthService,
        private flightService: FlightService
    ) {
    }
    searchParams: any;
    loggedInUser: any;

    ngOnInit() {
        this.respData = [];
        this.submitted=false;
        this.flightService.loading.subscribe(res => {
            this.loading = res;
        });
       
        this.flightService.flights.subscribe(flights => {
            this.flights = flights;
            if (this.submitted && this.flights.length > 0) {
            this.getFareQuote();
            }
        })
        this.getBookingReports();
    }

    getFareQuote() {
        this.flightService.loading.next(true);
        const req: any = {
            ResultToken: [this.flights[0].ResultToken],
            booking_source: this.flights[0].booking_source,
        }
        this.apiHandlerService.apiHandler('updateFareQuote', 'post', '', '', req)
            .subscribe(resp => {
                if (resp && ([200, 201].includes(resp.statusCode)) && resp.data) {
                    this.pnrRetrive(resp.data);
                }
                else {
                    this.flightService.loading.next(false);
                    this.swalService.alert.oops(resp.Message);
                }
            }, (err) => {
                this.flightService.loading.next(false);
                this.swalService.alert.oops(err.error.msg);
            });
    }

    pnrRetrive(resp){
        const created_by_id =(JSON.parse(localStorage.getItem('currentUser')))['id'];
        let TicketData = {
            AppReference: this.selectedRecord.AppReference,
            booking_source: this.selectedRecord.ApiCode,
            payment_type:'wallet',
            UserType: "B2B",
            UserId:created_by_id,
            ResultToken:this.flights[0].ResultToken,
            BrandResultToken:resp.BrandResultToken

        }
    this.apiHandlerService.apiHandler('pnrRetrieve', 'post', '', '', TicketData)
            .subscribe(res => {
                if (res) {
                     let confirmedData = res.data.FinalBooking.BookingDetails;
                     this.flightService.loading.next(false);
                     if (confirmedData.BookingStatus.toUpperCase()==="BOOKING_CONFIRMED") {
                        this.redirectToVoucher();
                    }
                    else
                    {
                        this.flightService.loading.next(false);
                        this.swalService.alert.oops("Sorry unable to process your request. Please contact reservation.");
                        this.router.navigate(['/']);
                    }
                }
            }, (err => {
                this.flightService.loading.next(false);
                this.swalService.alert.oops(err.error.Message)
            })
           );
    }
   
    redirectToVoucher(){
        this.router.navigate(['/booking/flight-approval'], { queryParams: { appReference:this.selectedRecord.AppReference } });
        localStorage.removeItem('selectedFlight');
        localStorage.setItem('selectedFlight', JSON.stringify(this.flights));
    }

    copy(appReference) {
        this.copied=true;
        this.reportsService.copy(appReference);
        setTimeout(() => {
            this.copied = false;
          }, 2000);
    }
    
    bookNow(data){
        this.loading=true;
        this.selectedRecord=data;
        this.submitted=true;
        let searchData=data.SearchData;
        searchData.AppReference=data.AppReference;
        searchData.SearchType='approval';
        let currentUser = this.utility.readStorage('currentUser', localStorage);
        this.flightService.searchResultApi(searchData);
    }

    getBookingReports() {
        let t = new Date()
        let fromDate = new Date(t.setDate(t.getDate() -1))
        let toDate = new Date(t.setDate(t.getDate() + 1))
        let reqBody = {
            "booked_to_date": toDate ? formatDate(toDate, 'YYYY-MM-DD') : "",
            "status": "",
            "app_reference": "",
            "pnr": "",
            "email": "",
        }
        this.getBookingReportsExt(reqBody);
    }

    getBookingReportsExt(reqBody) {
        this.apiHandlerService.apiHandler('flightApprovalRequest', 'post', '', '', reqBody)
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.airLineName = resp.data[0].DomainOrigin;
                    this.respData = resp.data;
                    respDataCopy = [...this.respData];
                    this.collectionSize = this.respData.length;
                    this.noData = false;

                } else {
                    this.noData = false;
                    this.respData = [];
                }
            }, (err) => {
                this.noData = false;
                this.respData = [];
            })
    }

    getVoucher(data) {
        const redirect_url = ''
        const voltureRoute = this.router.createUrlTree(['/employee/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } })
        this.router.navigate(['/reports/flight-voucher'], { queryParams: { AppReference: data.AppReference } });
    }

    onSelect(tab, i) {
    }

    beforeChange(e) {
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                AppReference: objData.AppReference,
                DomainOrigin: objData.FlightItineraries[0].airline_name,
                leadpax_name: objData.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].first_name,
                JourneyFrom: objData.JourneyFrom,
                JourneyTo: objData.JourneyTo,
                TripType: objData.TripType,
                total_fare: objData.total_fare,
                JourneyStart: objData.JourneyStart,
                booked_on: objData.booked_on,
                Status:objData.approvarStatus,
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
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'AppReference': return this.utility.compare('' + a.AppReference.toLocaleLowerCase(), '' + b.AppReference.toLocaleLowerCase(), isAsc);
                case 'DomainOrigin': return this.utility.compare('' + a.FlightItineraries[0].airline_name.toLocaleLowerCase(), '' + b.FlightItineraries[0].airline_name.toLocaleLowerCase(), isAsc);
                case 'leadpax_name': return this.utility.compare('' + a.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].first_name.toLocaleLowerCase(), '' + b.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].first_name.toLocaleLowerCase(), isAsc);
                case 'JourneyFrom': return this.utility.compare('' + a.JourneyFrom.toLocaleLowerCase(), '' + b.JourneyFrom.toLocaleLowerCase(), isAsc);
                case 'JourneyTo': return this.utility.compare('' + a.JourneyTo, '' + b.JourneyTo, isAsc);
                case 'TripType': return this.utility.compare('' + a.TripType, '' + b.TripType, isAsc);
                case 'total_fare': return this.utility.compare(+ a.total_fare, + b.total_fare, isAsc);
                case 'JourneyStart': return this.utility.compare('' + a.JourneyStart, '' + b.JourneyStart, isAsc);
                case 'booked_on': return this.utility.compare(+ a.booked_on, + b.booked_on, isAsc);
                default: return 0;
            }
        });
    }

    download(type: SupportedExtensions, orientation?: string) {
        document.getElementById('action').remove();
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `b2b-FlightReport`).subscribe((_) => {
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

    hasError = (controlName: string, errorName: string) => {
        return ((this.submitted || this.paymentForm.controls[controlName].touched) && this.paymentForm.controls[controlName].hasError(errorName));
    }

    showPaxProfile(data) {
        this.showPaxDetails = true;
        this.currentRecord = data;
        this.paxDetails = data.FlightBookingTransactions[0]['flightBookingTransactionPassengers'];
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    hide() {
        this.showPaxDetails = false;
        this.showPaymentDetails = false;
        this.showConfirm = false;
        //   this.showPaymentModal = false;
    }


    checkDateExtend(data: any): boolean {
        function getDateOnly(date: Date): Date {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
        const d1 = new Date();
        const d2 = new Date(data.JourneyStart);
        return getDateOnly(d1).getTime() <= getDateOnly(d2).getTime();
    }

    checkDate(data) {
        var d1 = new Date();
        var d2 = new Date(data.CreatedDatetime);
        if (d1.getDate() === d2.getDate()) {
            return d1.getHours() <= 23;
        }
    }

    cancelTicketPopup(data) {
        this.subjectName = 'Cancel';
        this.showConfirm = true;
        this.cancelData = data;
    }

    ngOnDestroy() {
        this.submitted=false;
     }


    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const userName = response.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].first_name + ' ' + response.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].middle_name + ' ' + response.FlightBookingTransactions[0].flightBookingTransactionPassengers[0].last_name;
            return {
                "Sl No.": index + 1,
                "Application Reference": response.AppReference,
                "Approvar Status": response.approvarStatus,
                "Request From":userName,
                "Requested On": moment(response.CreatedDatetime).format("DD MMM YYYY"),
                "From": response.JourneyFrom,
                "To": response.JourneyTo,
                "Travel Date": moment(response.JourneyStart).format("DD MMM YYYY"),

            }
        });

        const columnWidths = [
            { wch: 5 },
            { wch: 25 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 10 },
            { wch: 10 },
            { wch: 20 },
            { wch: 15 },
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Flight Report',
            columnWidths
        );
    }
}
