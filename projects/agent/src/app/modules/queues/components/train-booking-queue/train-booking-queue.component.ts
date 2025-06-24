import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { UtilityService } from 'projects/agent/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';

let filterArray: Array<any> = [];

@Component({
    selector: 'app-train-booking-queue',
    templateUrl: './train-booking-queue.component.html',
    styleUrls: ['./train-booking-queue.component.scss']
})
export class TrainBookingQueueComponent implements OnInit {
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
    showData: any=[];
    setMinDate: any;
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
        { key: 'status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: "employee_name", value: 'Employee Name' },
        // { key: 'booking_Type', value: 'Booking Type' },
        { key: 'train_From', value: 'Train From' },
        { key: 'train_To', value: 'Train To' },
        { key: 'train_Class', value: 'Train Class' },
        { key: 'train_Date', value: 'Travel Date' },
        { key: 'train_time', value: 'Travel Time' },
        { key: 'company_Name', value: 'Company Name' },
        { key: 'created_Date', value: 'Created On' }
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService,
        private modalService: NgbModal,
        private router: Router
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            train_app_reference: new FormControl('', [Validators.maxLength(120)]),
            train_status: new FormControl('BOOKING_PENDING', [Validators.maxLength(120)]),
            train_booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            train_booked_to_date: new FormControl('', [Validators.maxLength(120)]),
        });
        this.getTrainQueue();
    }

    getTrainQueue() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "booking_status": "BOOKING_PENDING"
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
                employee_name: objData.PaxDetails[0].FirstName + ' ' + objData.PaxDetails[0].LastName,
                // booking_Type: objData.TrainDetails.BookingType,
                train_From: objData.TrainDetails.From,
                train_To: objData.TrainDetails.To,
                train_Class: objData.TrainDetails.PreferredClass,
                train_Date: moment(objData.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                train_time:objData.TrainDetails.OnwardTime,
                company_Name: objData.TrainDetails.CompanyName != '' ? objData.TrainDetails.CompanyName : 'N/A',
                status: status,
                created_Date: moment(objData.TrainDetails.CreatedAt).format("MMM DD, YYYY, hh:mm:ss A"),
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
                "Booking Status": status,
                "Approvar Status": status,
                "Employee Name": response.PaxDetails[0].FirstName + ' ' + response.PaxDetails[0].LastName,
                // "Booking Type": response.TrainDetails.BookingType,
                "Train From": response.TrainDetails.From,
                "Train To": response.TrainDetails.To,
                "Train Class": response.TrainDetails.PreferredClass,
                "Train Date": response.TrainDetails.OnwardDate ? moment(response.TrainDetails.OnwardDate,"YYYY-MM-DD").format("MMM DD, YYYY"):'N/A',
                "Travel Time": response.TrainDetails.OnwardTime,
                "Company Name": response.TrainDetails.CompanyName != '' ? response.TrainDetails.CompanyName : 'N/A',
                "Created On": moment(response.TrainDetails.CreatedAt).format("MMM DD, YYYY"),
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
            'Train Queues',
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
                case 'approvar_status': return this.utility.compare('' + a.TrainDetails.BookingStatus, '' + b.TrainDetails.BookingStatus, isAsc);
                case 'employee_name': return this.utility.compare('' + a.PaxDetails[0].FirstName, '' + b.PaxDetails[0].LastName, isAsc);
                case 'booking_Type': return this.utility.compare('' + a.TrainDetails.BookingType, '' + b.TrainDetails.BookingType, isAsc);
                case 'train_From': return this.utility.compare('' + a.TrainDetails.From, '' + b.TrainDetails.From, isAsc);
                case 'train_To': return this.utility.compare('' + a.TrainDetails.To, '' + b.TrainDetails.To, isAsc);
                case 'train_Class': return this.utility.compare(+ a.TrainDetails.PreferredClass, + b.TrainDetails.PreferredClass, isAsc);
                case 'train_Date': return this.utility.compare(+ a.TrainDetails.OnwardDate, + b.TrainDetails.OnwardDate, isAsc);
                case 'train_time': return this.utility.compare(+ a.TrainDetails.OnwardTime, + b.TrainDetails.OnwardTime, isAsc);
                case 'company_Name': return this.utility.compare(+ a.TrainDetails.CompanyName, + b.TrainDetails.CompanyName, isAsc);
                case 'status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'created_Date': return this.utility.compare(+ a.TrainDetails.CreatedAt, + b.TrainDetails.CreatedAt, isAsc);
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
    }

    onSelectionChanged(event) {
    }
}