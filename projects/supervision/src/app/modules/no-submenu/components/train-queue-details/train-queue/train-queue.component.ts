import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { formatDate } from 'ngx-bootstrap/chronos';
let filterArray: Array<any> = [];

@Component({
    selector: 'app-train-queue',
    templateUrl: './train-queue.component.html',
    styleUrls: ['./train-queue.component.scss']
})
export class TrainQueueComponent implements OnInit {
    @Output() trainQueueUpdate = new EventEmitter<any>();
    @Input() queueType: any;
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    respDataCopy: any;
    showConfirm: boolean = false;
    isOpen = false as boolean;
    pageSize =10;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    subjectName: string;
    filteredCorp: Observable<string[]>;
    maxDate = new Date();
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    deleteData: any = [];
    corporateList: string[] = ['TripMartz'];
    isTatkal:boolean=false;
    cancellationRemark;
    showReject: boolean=false;
    showMessage: boolean=false;
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
        { key: 'invoice_no', value:'Invoice Number'},
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'booking_status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: 'booking_Type', value: 'Booking Type' },
        { key: 'employee_name', value: 'Employee Name' },
        { key: 'booking_Request_Type', value: 'Booking Request Type' },
        { key: 'booking_Request_Id', value: 'Booking Request Id' },
        { key: 'train_From', value: 'Train From' },
        { key: 'train_To', value: 'Train To' },
        { key: 'train_Class', value: 'Train Class' },
        { key: 'train_Date', value: 'Travel Date' },
        { key: 'company_Name', value: 'Company Name' },
        { key: 'created_Date', value: 'Booked Date' }
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.setOptions();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            train_app_reference: new FormControl('', [Validators.maxLength(120)]),
            train_status: new FormControl('BOOKING_PENDING', [Validators.maxLength(120)]),
            train_booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            train_booked_to_date: new FormControl('', [Validators.maxLength(120)]),
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
        let reqBody=this.setPayload();
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
                invoice_no:objData.TrainDetails.XlproInvoiceNo || 'N/A',
                booking_status:status,
                approvar_status: status,
                booking_Type:objData.TrainDetails.BookingType,
                employee_name: objData.PaxDetails[0].FirstName + ' ' + objData.PaxDetails[0].LastName,
                booking_Request_Type: objData.TrainDetails.BookingRequestType,
                booking_Request_Id:objData.TrainDetails.BookingRequestId,
                train_From: objData.TrainDetails.From,
                train_To: objData.TrainDetails.To,
                train_Class: objData.TrainDetails.PreferredClass,
                train_Date: moment(objData.TrainDetails.OnwardDate).format("MMM DD, YYYY"),
                company_Name: objData.TrainDetails.CompanyName != 'null' ? objData.TrainDetails.CompanyName : 'N/A',
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
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status = this.getFormtedStatus(response.TrainDetails.BookingStatus);
            return {
                "Sl No.": index + 1,
                "Application Reference": response.TrainDetails.AppReference,
                "Invoice No":response.TrainDetails.XlproInvoiceNo,
                "Booking Status": status,
                "Approvar Status": response.TrainDetails.ApprovalStatus || 'PENDING',
                "Employee Name": response.PaxDetails[0].FirstName + ' ' + response.PaxDetails[0].LastName,
                "Booking Type":response.TrainDetails.BookingType,
                "Booking Request Type": response.TrainDetails.BookingRequestType,
                "Booking Request Id": response.TrainDetails.BookingRequestId || 'N/A',
                "Train From": response.TrainDetails.From,
                "Train To": response.TrainDetails.To,
                "Train Class": response.TrainDetails.PreferredClass,
                "Travel Date": moment(response.TrainDetails.OnwardDate).format("DD MMM YYYY"),
                "Company Name": response.TrainDetails.CompanyName != 'null' ? response.TrainDetails.CompanyName : 'N/A',
                "Booked Date": moment(response.TrainDetails.CreatedAt).format("DD MMM YYYY"),
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
            'Train Queues',
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
        this.showReject=false;
        this.cancellationRemark='';
    }

    showRejectReason(){
        this.showReject=true;
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
                case 'invoice_no': return this.utility.compare('' + a.TrainDetails.XlproInvoiceNo, '' + b.TrainDetails.XlproInvoiceNo, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.TrainDetails.BookingStatus, '' + b.TrainDetails.BookingStatus, isAsc);
                case 'booking_Type': return this.utility.compare('' + a.TrainDetails.BookingType, '' + b.TrainDetails.BookingType, isAsc);
                case 'employee_name': return this.utility.compare('' + a.PaxDetails[0].FirstName, '' + b.PaxDetails[0].LastName, isAsc);
                case 'booking_Request_Type': return this.utility.compare('' + a.TrainDetails.BookingRequestType, '' + b.TrainDetails.BookingRequestType, isAsc);
                case 'booking_Request_Id': return this.utility.compare('' + a.TrainDetails.BookingRequestId, '' + b.TrainDetails.BookingRequestId, isAsc);
                case 'train_From': return this.utility.compare('' + a.TrainDetails.From, '' + b.TrainDetails.From, isAsc);
                case 'train_To': return this.utility.compare('' + a.TrainDetails.To, '' + b.TrainDetails.To, isAsc);
                case 'train_Class': return this.utility.compare(+ a.TrainDetails.PreferredClass, + b.TrainDetails.PreferredClass, isAsc);
                case 'train_Date': return this.utility.compare(+ a.TrainDetails.OnwardDate, + b.TrainDetails.OnwardDate, isAsc);
                case 'company_Name': return this.utility.compare(+ a.TrainDetails.CompanyName, + b.TrainDetails.CompanyName, isAsc);
                case 'status': return this.utility.compare(+ a.TrainDetails.BookingStatus, + b.TrainDetails.BookingStatus, isAsc);
                case 'created_Date': return this.utility.compare(+ a.TrainDetails.CreatedAt, + b.TrainDetails.CreatedAt, isAsc);
                default: return 0;
            }
        });
    }


    deleteRequest() {
        if(this.cancellationRemark==''){
            return;
        }
        this.loading = true;
        this.showConfirm = false;
        this.apiHandlerService.apiHandler('deleteTrain', 'POST', '', '', { TrainDetailId: this.deleteData.TrainDetails.TrainDetailId, cancellation_remark:this.cancellationRemark }).subscribe(res => {
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

    moveToTatkal1(data) {
        this.loading = true;
        this.showConfirm = false;
        let payload={ id: data.TrainDetails.TrainDetailId,TicketType:'Tatkal1'};
        this.moveToTatkal(payload);
    }

    moveToTatkal2(data) {
        this.loading = true;
        this.showConfirm = false;
        let payload={ id: data.TrainDetails.TrainDetailId,TicketType:'Tatkal2'};
        this.moveToTatkal(payload);
    }

    moveToTatkal(payload){
        this.apiHandlerService.apiHandler('updateTicketType', 'POST', '', '',payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Updated successfully!!');
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
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
    }

    confirmDelete(data) {
        this.deleteData = data;
        this.showConfirm = true;
        this.showReject=false;
        this.cancellationRemark='';
    }

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            train_app_reference: '',
            train_booked_from_date: '',
            train_booked_to_date: '',
            train_status: 'BOOKING_PENDING'
        });
        this.getTrainQueue();
    }

    setOptions(){
        this.isTatkal = (this.queueType === 'general') ? false : true;
    }

    setPayload() {
        let reqBody = {
            "Status": this.regConfig.get('train_status').value,
            "ReservationCode": this.regConfig.get('train_app_reference').value,
            "BookedFromDate": this.regConfig.get('train_booked_from_date').value ? formatDate(this.regConfig.get('train_booked_from_date').value, 'YYYY-MM-DD') : "",
            "BookedToDate": this.regConfig.get('train_booked_to_date').value ? formatDate(this.regConfig.get('train_booked_to_date').value, 'YYYY-MM-DD') : "",
            "ReportType": "Queues",
            "TicketType": ''
        };
        if (this.queueType === 'tatkal-1') {
            reqBody.TicketType = 'Tatkal1';
        } else if (this.queueType === 'tatkal-2') {
            reqBody.TicketType = 'Tatkal2';
        }
        return reqBody;
    }

    onSelectionChanged(event) {
    }

}
