import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { ViewTrainBookingComponent } from './components/view-train-booking/view-train-booking.component';
import { Router } from '@angular/router';
import { ReportService } from '../../reports.service';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ThemeOptions } from 'projects/student/src/app/theme-options';

let filterArray: Array<any> = [];

@Component({
    selector: 'app-train-booking-report',
    templateUrl: './train-booking-report.component.html',
    styleUrls: ['./train-booking-report.component.scss']
})
export class TrainBookingReportComponent implements OnInit {
    @Output() trainQueueUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchType = 'train';
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    respDataCopy: any;
    showConfirm: boolean = false;
    isOpen = false as boolean;
    pageSize = 10;
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
    showData: any=[];
    setMinDate: any;
    status:string="";
    hideOther:boolean=false;
    cancellationRemark: string = '';
    maxDate = new Date();
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'request_ID', value: 'Application Reference' },
        { key: 'invoice_no', value: 'Invoice No' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: 'pnr', value: 'PNR' },
        { key: 'train_From', value: 'Train From' },
        { key: 'train_To', value: 'Train To' },
        { key: 'train_Class', value: 'Class' },
        { key: 'quote', value: 'Quote' },
        { key: 'trainName', value: 'Train Name' },
        { key: 'trainNo', value: 'Train No' },
        { key: 'totalFare', value: 'Total Fare' },
        { key: 'train_Date', value: 'Travel Date' },
        { key: 'train_time', value: 'Travel Time' },
        { key: 'created_Date', value: 'Created On' },
        { key: 'employee_cancellation_remark', value: 'Employee Cancellation Remark' },
        { key: 'cancellation_ts', value: 'Cancellation Requested Date' },
        { key: 'admin_cancellation_remark', value: 'Admin Cancellation Remark' },
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
        private router: Router,
        private reportsService:ReportService,
        private globals: ThemeOptions
    ) { }

    ngOnInit() {
        this.hideOther = this.globals.hideOther;
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            train_app_reference: new FormControl('', [Validators.maxLength(120)]),
            train_status: new FormControl('ALL', [Validators.maxLength(120)]),
            train_booked_from_date: new FormControl(fromDate, [Validators.maxLength(120)]),
            train_booked_to_date: new FormControl(toDate, [Validators.maxLength(120)]),
        });
        this.getTrainQueue();
    }

    getTrainQueue() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "Status": this.regConfig.get('train_status').value,
            "ApplicationReference": this.regConfig.get('train_app_reference').value,
            "From": this.regConfig.get('train_booked_from_date').value ? formatDate(this.regConfig.get('train_booked_from_date').value, 'YYYY-MM-DD') : "",
            "To": this.regConfig.get('train_booked_to_date').value ? formatDate(this.regConfig.get('train_booked_to_date').value, 'YYYY-MM-DD') : "",
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
                approvar_status: status,
                invoice_no:objData.TrainDetails.XlproInvoiceNo,
                pnr:objData.TrainDetails.PNR,
                train_From: objData.TrainDetails.From,
                train_To: objData.TrainDetails.To,
                train_Class: objData.TrainDetails.PreferredClass,
                quote:objData.TrainDetails.Quote,
                trainName:objData.TrainDetails.TrainName,
                trainNo:objData.TrainDetails.TrainNumber,
                totalFare:objData.TrainDetails.TotalFare,
                train_Date: moment(objData.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                train_time:objData.TrainDetails.OnwardTime,
                status: status,
                employee_cancellation_remark:objData.TrainDetails.CancellationFeedback,
                cancellation_ts:objData.TrainDetails.CancellationDate,
                admin_cancellation_remark:objData.TrainDetails.CancelConfirmationFeedback,
                admin_cancellation_ts:objData.TrainDetails.CancelConfirmationDate,
                cancellation_charge:objData.TrainDetails.CancellationCharges,
                cancelled_by_id:objData.TrainDetails.CancelledByName,
                created_Date: moment(objData.TrainDetails.CreatedAt).format("MMM DD, YYYY"),
                trip_id:objData.TrainDetails.TripId,
                trip_name:objData.TrainDetails.TripName,

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
                "Invoice No":response.TrainDetails.XlproInvoiceNo || 'N/A',
                "Trip Id": response.TrainDetails.TripId || 'N/A',
                "Trip Name": response.TrainDetails.TripName || 'N/A',
                "Booking Status": status,
                "Approvar Status": response.TrainDetails.ApprovalStatus || 'PENDING',
                "PNR":response.TrainDetails.PNR || 'N/A',
                "Train From": response.TrainDetails.From,
                "Train To": response.TrainDetails.To,
                "Class": response.TrainDetails.PreferredClass,
                "Quote": response.TrainDetails.Quote || 'N/A',
                "Train Name": response.TrainDetails.TrainName || 'N/A',
                "Train No": response.TrainDetails.TrainNumber || 'N/A',
                "Total Fare": response.TrainDetails.TotalFare || 'N/A',
                "Travel Date": response.TrainDetails.OnwardDate ? moment(response.TrainDetails.OnwardDate,"YYYY-MM-DD").format("DD MMM YYYY"):'N/A',
                "Travel Time": response.TrainDetails.OnwardTime,
                "Created On": moment(response.TrainDetails.CreatedAt).format("DD MMM YYYY"),
                "Employee Cancellation Remark":response.TrainDetails.CancellationFeedback|| 'N/A',
                "Cancellation Requested Date":response.TrainDetails.CancellationDate ? moment(response.TrainDetails.CancellationDate).format("DD MMM YYYY"):'N/A',
                "Admin Cancellation Remark":response.TrainDetails.CancelConfirmationFeedback || 'N/A',
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
        this.cancellationRemark='';
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
                case 'approvar_status': return this.utility.compare('' + a.TrainDetails.BookingStatus, '' + b.TrainDetails.BookingStatus, isAsc);
                case 'pnr': return this.utility.compare('' + a.TrainDetails.pnr, '' + b.TrainDetails.pnr, isAsc);
                case 'quote': return this.utility.compare('' + a.TrainDetails.quote, '' + b.TrainDetails.quote, isAsc);
                case 'trainName': return this.utility.compare('' + a.TrainDetails.trainName, '' + b.TrainDetails.trainName, isAsc);
                case 'booking_Type': return this.utility.compare('' + a.TrainDetails.BookingType, '' + b.TrainDetails.BookingType, isAsc);
                case 'trainNo': return this.utility.compare('' + a.TrainDetails.trainNo, '' + b.TrainDetails.trainNo, isAsc);
                case 'train_From': return this.utility.compare('' + a.TrainDetails.From, '' + b.TrainDetails.From, isAsc);
                case 'totalFare': return this.utility.compare('' + a.TrainDetails.totalFare, '' + b.TrainDetails.totalFare, isAsc);
                case 'train_To': return this.utility.compare('' + a.TrainDetails.To, '' + b.TrainDetails.To, isAsc);
                case 'train_Class': return this.utility.compare(+ a.TrainDetails.PreferredClass, + b.TrainDetails.PreferredClass, isAsc);
                case 'train_Date': return this.utility.compare(+ a.TrainDetails.OnwardDate, + b.TrainDetails.OnwardDate, isAsc);
                case 'train_time': return this.utility.compare(+ a.TrainDetails.OnwardTime, + b.TrainDetails.OnwardTime, isAsc);
                case 'status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'employee_cancellation_remark': return this.utility.compare(+ a.TrainDetails.CancellationFeedback, + b.TrainDetails.CancellationFeedback, isAsc);
                case 'cancellation_ts': return this.utility.compare(+ a.TrainDetails.CancellationDate, + b.TrainDetails.CancellationDate, isAsc);
                case 'admin_cancellation_remark': return this.utility.compare(+ a.TrainDetails.CancelConfirmationFeedback, + b.TrainDetails.CancelConfirmationFeedback, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.TrainDetails.CancelConfirmationDate, + b.TrainDetails.CancelConfirmationDate, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.TrainDetails.CancellationCharges, + b.TrainDetails.CancellationCharges, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.TrainDetails.CancelledByName, + b.TrainDetails.CancelledByName, isAsc);
                case 'created_Date': return this.utility.compare(+ a.TrainDetails.CreatedAt, + b.TrainDetails.CreatedAt, isAsc);
                case 'trip_id': return this.utility.compare(+ a.TrainDetails.TripId, + b.TrainDetails.TripId, isAsc);
                case 'trip_name': return this.utility.compare(+ a.TrainDetails.TripName, + b.TrainDetails.TripName, isAsc);
                case 'invoice_no': return this.utility.compare(+ a.TrainDetails.XlproInvoiceNo, + b.TrainDetails.XlproInvoiceNo, isAsc);
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

    confirmDelete(data,status) {
        this.deleteData = data;
        this.cancellationRemark='';
        this.showConfirm = true;
        this.status=status;
    }

    openModel(data: any) {
        const modalRef = this.modalService.open(ViewTrainBookingComponent);
        modalRef.componentInstance.data = data;
      }

      eticket(data: any){
        const appReference=data.TrainDetails.AppReference
        this.router.navigate(['/reports/train-voucher'], { queryParams: { appReference } });
      }

      getInvoice(data: any){
        const appReference=data.TrainDetails.AppReference
        this.router.navigate(['/reports/train-invoice'], { queryParams: { appReference } });
      }

      copy(appReference) {
        this.reportsService.copy(appReference);
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
        if (this.cancellationRemark.trim() === "") {
            this.cancellationRemark='';
            return;
        }
        this.loading = true;
        this.showConfirm = false;
        let payload={
            AppReference: this.deleteData.TrainDetails.AppReference,
            CancellationFeedback:this.cancellationRemark,
            CancellationCharges:this.cancellationRemark
        }
        this.apiHandlerService.apiHandler('trainCancel', 'POST', '', '', payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Cancelled successfully!!');
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



    onSelectionChanged(event) {
    }
}