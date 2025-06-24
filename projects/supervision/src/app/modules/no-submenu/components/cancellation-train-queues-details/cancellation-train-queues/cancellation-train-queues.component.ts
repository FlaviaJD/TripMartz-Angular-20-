import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
let filterArray: Array<any> = [];

@Component({
  selector: 'app-cancellation-train-queues',
  templateUrl: './cancellation-train-queues.component.html',
  styleUrls: ['./cancellation-train-queues.component.scss']
})
export class CancellationTrainQueuesComponent implements OnInit {
    @Output() trainQueueUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    respDataCopy: any;
    showConfirm: boolean = false;
    maxDate = new Date();
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
    corporateList: string[] = ['TripMartz'];
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
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'booking_status', value: 'Booking Status' },
        { key: 'requested_Date', value: 'Cancellation Requested Date' },
        { key: 'employee_reason', value: 'Employee Reason' },
        { key: "employee_name", value: 'Employee Name' },
        { key: 'train_From', value: 'Train From' },
        { key: 'train_To', value: 'Train To' },
        { key: 'train_Class', value: 'Train Class' },
        { key: 'train_Date', value: 'Train Date' },
      
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            train_app_reference: new FormControl('', [Validators.maxLength(120)]),
            train_status: new FormControl('CANCELLATION_PENDING', [Validators.maxLength(120)]),
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
        this.noData=true;
        this.respData=[];
         let reqBody = {
            "Status": this.regConfig.get('train_status').value,
            "ReservationCode":this.regConfig.get('train_app_reference').value,
            "BookedFromDate":this.regConfig.get('train_booked_from_date').value? formatDate(this.regConfig.get('train_booked_from_date').value, 'YYYY-MM-DD') : "",
            "BookedToDate": this.regConfig.get('train_booked_to_date').value? formatDate(this.regConfig.get('train_booked_to_date').value, 'YYYY-MM-DD') : "",
            "ReportType":"CancellationQueues"
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
                booking_status:status,
                trip_id:objData.TrainDetails.TripId,
                trip_name:objData.TrainDetails.TripName,
                employee_name: objData.PaxDetails[0].FirstName + ' ' + objData.PaxDetails[0].LastName,
                train_From: objData.TrainDetails.From,
                train_To: objData.TrainDetails.To,
                train_Class: objData.TrainDetails.PreferredClass,
                requested_Date:objData.TrainDetails.CancellationDate,
                employee_reason:objData.TrainDetails.CancellationFeedback,
                train_Date: moment(objData.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                status: status,

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
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status = this.getFormtedStatus(response.TrainDetails.BookingStatus);
            return {
                "Sl No.": index + 1,
                "Application Reference": response.TrainDetails.AppReference,
                "Trip Id": response.TrainDetails.TripId || 'N/A',
                "Trip Name": response.TrainDetails.TripName || 'N/A',
                "Booking Status": status,
                // "Approvar Status": status,
                "Cancellation Requested Date": response.TrainDetails.CancellationDate? moment(response.CancellationDate).format("DD MMM YYYY"):'N/A',
                "Employee Reason": response.TrainDetails.CancellationFeedback? response.TrainDetails.CancellationFeedback:'N/A',
                "Employee Name": response.PaxDetails[0].FirstName + ' ' + response.PaxDetails[0].LastName,
                "Train From": response.TrainDetails.From,
                "Train To": response.TrainDetails.To,
                "Train Class": response.TrainDetails.PreferredClass,
                "Train Date": moment(response.TrainDetails.OnwardDate).format("DD MMM YYYY"),
                // "Company Name": response.TrainDetails.CompanyName != 'undefined' ? response.TrainDetails.CompanyName : 'N/A',
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
        ];
        this.utility.exportToExcel(
            fileToExport,
            'Train Cancellation Queues',
            columnWidths
        );
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
                case 'employee_name': return this.utility.compare('' + a.PaxDetails[0].FirstName, '' + b.PaxDetails[0].LastName, isAsc);
                case 'train_From': return this.utility.compare('' + a.TrainDetails.From, '' + b.TrainDetails.From, isAsc);
                case 'train_To': return this.utility.compare('' + a.TrainDetails.To, '' + b.TrainDetails.To, isAsc);
                case 'train_Class': return this.utility.compare(+ a.TrainDetails.PreferredClass, + b.TrainDetails.PreferredClass, isAsc);
                case 'train_Date': return this.utility.compare(+ a.TrainDetails.OnwardDate, + b.TrainDetails.OnwardDate, isAsc);
                case 'status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'requested_Date': return this.utility.compare('' + a.TrainDetails.CancellationDate, '' + b.TrainDetails.CancellationDate, isAsc);
                case 'employee_reason': return this.utility.compare('' + a.TrainDetails.CancellationFeedback, '' + b.TrainDetails.CancellationFeedback, isAsc);
                case 'trip_id': return this.utility.compare(+ a.TrainDetails.TripId, + b.TrainDetails.TripId, isAsc);
                case 'trip_name': return this.utility.compare(+ a.TrainDetails.TripName, + b.TrainDetails.TripName, isAsc);
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

    confirmDelete(data) {
        this.deleteData = data;
        this.showConfirm = true;
    }

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            train_app_reference: '',
            train_booked_from_date: fromDate,
            train_booked_to_date: toDate,
            train_status: 'BOOKING_PENDING'
        });
        this.getTrainQueue();
    }

    onSelectionChanged(event) {
    }

}

