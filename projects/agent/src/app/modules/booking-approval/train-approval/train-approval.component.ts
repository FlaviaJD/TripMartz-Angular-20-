import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { Observable } from 'rxjs/internal/Observable';
import { SubSink } from 'subsink';
import { ApiHandlerService } from '../../../core/api-handlers';
import { UtilityService } from '../../../core/services/utility.service';
import { SwalService } from '../../../core/services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ReportService } from '../../reports/reports.service';
let filterArray: Array<any> = [];

@Component({
  selector: 'app-train-approval',
  templateUrl: './train-approval.component.html',
  styleUrls: ['./train-approval.component.scss']
})
export class TrainApprovalComponent implements OnInit {

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
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: 'train_From', value: 'Train From' },
        { key: 'train_To', value: 'Train To' },
        { key: 'train_Class', value: 'Class' },
        { key: 'train_Date', value: 'Travel Date' },
        { key: 'train_time', value: 'Travel Time' },
        { key: 'created_Date', value: 'Created On' }
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
    ) { }

    ngOnInit() {
        this.getTrainPendingList();
    }

    getTrainPendingList() {
        this.noData=true;
        this.respData=[];
        this.apiHandlerService.apiHandler('trainPendingApprovalBookingList', 'POST', {}, {}, {}).subscribe(res => {
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
            return {
                "Sl No.": index + 1,
                "Application Reference": response.TrainDetails.AppReference,
                "Approvar Status": response.TrainDetails.ApprovalStatus || "PENDING",
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
                default: return 0;
            }
        });
    }

    
    confirmDelete(data,status) {
        this.deleteData = data;
        this.cancellationRemark='';
        this.showConfirm = true;
        this.status=status;
    }

   
      copy(appReference) {
        this.reportsService.copy(appReference);
    }

    showTemplate(data){
        this.router.navigate(['/booking/train-approval-template'], { state: { data: data } });
    }

    onSelectionChanged(event) {
    }
}
