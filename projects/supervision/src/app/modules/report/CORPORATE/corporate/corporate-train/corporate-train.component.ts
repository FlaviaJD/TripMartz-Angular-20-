import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ViewTrainBookingComponent } from './view-train-booking/view-train-booking.component';
let filterArray: Array<any> = [];

@Component({
    selector: 'app-corporate-train',
    templateUrl: './corporate-train.component.html',
    styleUrls: ['./corporate-train.component.scss']
})
export class CorporateTrainComponent implements OnInit {
    @Output() trainQueueUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    respDataCopy: any;
    showConfirm: boolean = false;
    isOpen = false as boolean;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    subjectName: string;
    filteredCorp: Observable<string[]>;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    deleteData: any = [];
    corporateList: string[] = ['TripMartz'];
    status: string = "";
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'request_ID', value: 'Application Reference' },
        { key:'invoice_no',value:'Invoice No'},
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Booking Status' },
        { key: 'app_status', value: 'Approvar Status' },
        { key: 'bookingType', value: 'Booking Type' },
        { key: 'request_created_date', value:'Request Created Date'},
        { key: 'booking_confirmation_date', value:'Booking Confirmation Date'},
        { key: 'pnr', value: 'PNR' },
        { key: 'corporate', value: 'Corporate Name' },
        { key: "passenger_name", value: 'Passenger Name' },
        { key: 'phone', value: 'Phone' },
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
        { key: 'cancelled_by_id', value: 'Cancelled By' }
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            train_app_reference: new FormControl('', [Validators.maxLength(120)]),
            train_status: new FormControl('ALL', [Validators.maxLength(120)]),
            train_email:new FormControl('', [Validators.maxLength(120)]),
            train_pnr:new FormControl('', [Validators.maxLength(120)]),
            train_booked_from_date: new FormControl(fromDate, [Validators.maxLength(120)]),
            train_booked_to_date: new FormControl(toDate, [Validators.maxLength(120)]),
            corporate: new FormControl('', [Validators.maxLength(120)]),
        });
        this.setCorporate();
        this.getTrainQueue();
    }

    setCorporate() {
        this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter(corporate => corporate.toLowerCase().includes(filterValue));
    }

    getTrainQueue() {
        this.noData = true;
        this.respData = [];
        let reqBody = {
            "Status": this.regConfig.get('train_status').value,
            "ReservationCode": this.regConfig.get('train_app_reference').value,
            "BookedFromDate": this.regConfig.get('train_booked_from_date').value ? formatDate(this.regConfig.get('train_booked_from_date').value, 'YYYY-MM-DD') : "",
            "BookedToDate": this.regConfig.get('train_booked_to_date').value ? formatDate(this.regConfig.get('train_booked_to_date').value, 'YYYY-MM-DD') : "",
            "ReportType":"Report"
        }
        this.apiHandlerService.apiHandler('trainFindAll', 'POST', '', '', reqBody).subscribe(res => {
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
                status: status,
                invoice_no:objData.TrainDetails.XlproInvoiceNo,
                pnr: objData.TrainDetails.PNR,
                bookingType:objData.TrainDetails.BookingType,
                request_created_date:objData.TrainDetails.RequestDate,
                booking_confirmation_date:objData.TrainDetails.BookingConfirmedDate,
                passenger_name: objData.PaxDetails[0].FirstName + ' ' + objData.PaxDetails[0].LastName,
                phone: objData.PaxDetails[0].MobileNo,
                email: objData.PaxDetails[0].Email,
                corporate: objData.TrainDetails.CompanyName,
                quote: objData.TrainDetails.TicketType,
                train_Date: moment(objData.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                bookedBy: objData.BookedByName,
                train_From: objData.TrainDetails.From,
                train_To: objData.TrainDetails.To,
                train_Class: objData.TrainDetails.PreferredClass,
                trainName: objData.TrainDetails.TrainName,
                trainNo: objData.TrainDetails.TrainNumber,
                totalFare: objData.TrainDetails.TotalFare,
                admin_cancellation_ts:objData.TrainDetails.CancelConfirmationDate,
                cancellation_charge:objData.TrainDetails.CancellationCharges,
                cancelled_by_id:objData.TrainDetails.CancelledByName,
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

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status = this.getFormtedStatus(response.TrainDetails.BookingStatus);
            return {
                "Sl No.": index + 1,
                "Application Reference": response.TrainDetails.AppReference,
                "Invoice No":response.TrainDetails.XlproInvoiceNo,
                "Booking Status": status,
                "Approvar Status":response.TrainDetails.ApprovalStatus|| 'Pending',
                "Booking Type":response.TrainDetails.BookingType|| 'N/A',
                "Request Created Date":response.TrainDetails.RequestDate? moment(response.TrainDetails.RequestDate).format("DD MMM YYYY"): 'N/A',
                "Booking Confirmation Date":response.TrainDetails.BookingConfirmedDate? moment(response.TrainDetails.BookingConfirmedDate).format("DD MMM YYYY"): 'N/A',
                "PNR": response.TrainDetails.PNR || 'N/A',
                "Corporate Name": response.TrainDetails.CompanyName|| 'N/A',
                "Passenger Name": response.PaxDetails[0].FirstName + ' ' + response.PaxDetails[0].LastName,
                "Phone": response.PaxDetails[0].MobileNo,
                "Email": response.PaxDetails[0].Email,
                "Travel Date": moment(response.TrainDetails.OnwardDate).format("DD MMM YYYY"),
                "Booked By": response.BookedByName|| 'N/A',
                "Train From": response.TrainDetails.From,
                "Train To": response.TrainDetails.To,
                "Fare Quota": response.TrainDetails.TicketType|| 'N/A',
                "Class": response.TrainDetails.PreferredClass,
                "Train Name": response.TrainDetails.TrainName|| 'N/A',
                "Train No": response.TrainDetails.TrainNumber|| 'N/A',
                "Total Fare": response.TrainDetails.TotalFare || 'N/A',
                "Admin Cancellation Date":response.TrainDetails.CancelConfirmationDate ? moment(response.TrainDetails.CancelConfirmationDate).format("DD MMM YYYY"):'N/A',
                "Cancellation Charge":response.TrainDetails.CancellationCharges|| 'N/A',
                "Cancelled By":response.TrainDetails.CancelledByName|| 'N/A',
            }
        });
        const columnWidths = [
            { wch: 5 }
        ];
        const fieldsLength = this.respData.length;
        for (let i = 0; i < fieldsLength; i++) {
            columnWidths.push({ wch: 30 })
        }
        this.utility.exportToExcel(
            fileToExport,
            'Train Report',
            columnWidths
        );
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onSearchSubmit() {
        this.getTrainQueue();
    }

    hide() {
        this.showConfirm = false;
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
                case 'request_ID': return this.utility.compare('' + a.TrainDetails.AppReference, '' + b.TrainDetails.AppReference, isAsc);
                case 'invoice_no': return this.utility.compare(+ a.TrainDetails.XlproInvoiceNo, + b.TrainDetails.XlproInvoiceNo, isAsc);
                case 'status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'pnr': return this.utility.compare('' + a.TrainDetails.PNR, '' + b.TrainDetails.PNR, isAsc);
                case 'bookingType':return this.utility.compare('' + a.TrainDetails.BookingType, '' + b.TrainDetails.BookingType, isAsc);
                case 'booked_by': return this.utility.compare(+ a.BookedByName, + b.BookedByName, isAsc);
                case 'request_created_date': return this.utility.compare(+ a.TrainDetails.RequestDate, + b.TrainDetails.RequestDate, isAsc);
                case 'booking_confirmation_date': return this.utility.compare(+ a.TrainDetails.BookingConfirmedDate, + b.TrainDetails.BookingConfirmedDate, isAsc);
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
                case 'cancelled_by_id': return this.utility.compare(+ a.TrainDetails.CancelledByName, + b.TrainDetails.CancelledByName, isAsc);
                default: return 0;
            }
        });
    }


    deleteRequest() {
        this.loading = true;
        this.showConfirm = false;
        this.apiHandlerService.apiHandler('deleteTrain', 'POST', '', '', { TrainDetailId: this.deleteData.TrainDetails.TrainDetailId }).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Deleted successfully!!');
                this.getTrainQueue();
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

    updateTrainQueue(data: any) {
        this.trainQueueUpdate.emit({ tabId: 'add_update_train_queue', data });
    }

    confirmDelete(data, status) {
        this.deleteData = data;
        this.showConfirm = true;
        this.status = status;
    }

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            train_app_reference: '',
            train_booked_from_date: fromDate,
            train_booked_to_date: toDate,
            train_status: 'ALL'
        });
        this.getTrainQueue();
    }

    cancelRequest() {
        this.showConfirm = false;
    }

    openModel(data: any) {
        const modalRef = this.modalService.open(ViewTrainBookingComponent);
        modalRef.componentInstance.data = data;
    }
    
    getStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1] + ' ' + tmpStatus[2]}`
    }

    onSelectionChanged(event) {
    }


}
