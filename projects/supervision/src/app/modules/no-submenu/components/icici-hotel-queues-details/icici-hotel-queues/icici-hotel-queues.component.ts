import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { ReportService } from '../../../../report/report.service';
let filterArray: Array<any> = [];

@Component({
  selector: 'app-icici-hotel-queues',
  templateUrl: './icici-hotel-queues.component.html',
  styleUrls: ['./icici-hotel-queues.component.scss']
})
export class IciciHotelQueuesComponent implements OnInit {
    @Output() iciciHotelQueueUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    data:any;
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
    maxDate = new Date();
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    deleteData: any = [];
    showData: any=[];
    setMinDate: any;
    cancellationRemark;
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
        { key: 'employee_name', value: 'Employee Name' },
        { key: 'booking_Request_Type', value: 'Booking Request Type' },
        { key: 'hotelName', value: 'Hotel Name' },
        { key: 'guestHouse', value: 'Guest House' },
        { key: 'meal_preference', value: 'Meal Preference' },
        { key: 'hotel_city', value: 'City' },
        { key: 'hotel_Location', value: 'Location' },
        { key: 'checkInDate', value: 'CheckIn Date' },
        { key: 'checkInTime', value: 'CheckIn Time' },
        { key: 'checkOutDate', value: 'CheckOut Date' },
        { key: 'checkOutTime', value: 'CheckOut Time' },
        { key: 'created_Date', value: 'Created On' }
    ];
    showReject: boolean=false;
    showMessage: boolean=false;
   
    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService,
        private modalService: NgbModal,
        private router: Router,
        private reportsService: ReportService
    ) { }
   
    ngOnInit() {
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            hotel_app_reference: new FormControl('', [Validators.maxLength(120)]),
            hotel_status: new FormControl('BOOKING_PENDING', [Validators.maxLength(120)]),
            hotel_booked_from_date: new FormControl(fromDate, [Validators.maxLength(120)]),
            hotel_booked_to_date: new FormControl(toDate, [Validators.maxLength(120)]),
        });
        this.getHotelQueue();
    }
   
    getHotelQueue() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "Status":this.regConfig.get('hotel_status').value,
            "ApplicationReference":this.regConfig.get('hotel_app_reference').value,
            "From": this.regConfig.get('hotel_booked_from_date').value? formatDate(this.regConfig.get('hotel_booked_from_date').value, 'YYYY-MM-DD') : "",
            "To": this.regConfig.get('hotel_booked_to_date').value? formatDate(this.regConfig.get('hotel_booked_to_date').value, 'YYYY-MM-DD') : "",
        }
        this.apiHandlerService.apiHandler('iciciHotelFindAll', 'POST', '', '', reqBody).subscribe(res => {
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
            const status = this.getFormtedStatus(objData.HotelDetails.BookingStatus);
            const filterOnFields = {
                request_ID: objData.HotelDetails.request_id,
                status: status,
                approvar_status: objData.HotelDetails.ApprovalStatus,
                approval_required:objData.HotelDetails.ApprovalRequired,
                booking_Type:objData.HotelDetails.BookingType,
                employee_name: objData.PaxDetails[0].FirstName + ' ' + objData.PaxDetails[0].LastName,
                booking_Request_Type: objData.HotelDetails.BookingRequestType,
                booking_Request_Id:objData.HotelDetails.BookingRequestId,
                meal_preference:objData.HotelDetails.MealPreference,
                hotel_city: objData.HotelDetails.City,
                hotel_Location: objData.HotelDetails.Location,
                checkInDate: moment(objData.HotelDetails.CheckInDate).format("MMM DD, YYYY"),
                checkInTime:objData.HotelDetails.CheckInTime,
                checkOutDate: moment(objData.HotelDetails.CheckOutDate).format("MMM DD, YYYY"),
                checkOutTime: objData.HotelDetails.CheckOutTime != '' ? objData.HotelDetails.CheckOutTime : 'N/A',
                guestHouse: objData.HotelDetails.GuestHouse != '' ? objData.HotelDetails.GuestHouse : 'N/A',
                hotelName: objData.HotelDetails.HotelName != '' ? objData.HotelDetails.HotelName : 'N/A',
                created_Date: moment(objData.HotelDetails.CreatedAt).format("MMM DD, YYYY, hh:mm:ss A"),
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
        if (this.respData && this.respData.length) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status = this.getFormtedStatus(response.HotelDetails.BookingStatus);
            let approvalStatus =response.HotelDetails.ApprovalRequired=='NO'?'NOT REQUIRED':(response.HotelDetails.ApprovalRequired || 'PENDING');
            return {
                "Sl No.": index + 1,
                "Application Reference": response.HotelDetails.request_id,
                "Booking Status": status,
                "Approvar Status": approvalStatus,
                // "Approval Required": response.HotelDetails.ApprovalRequired || 'PENDING',
                // "Booking Type":response.HotelDetails.BookingType || 'N/A',
                "Employee Name": response.PaxDetails[0].FirstName + ' ' + response.PaxDetails[0].LastName,
                "Booking Request Type":  response.HotelDetails.BookingRequestType || 'N/A',
                // "Booking Request Id": response.HotelDetails.BookingRequestId  || 'N/A',
                "Hotel Name": response.HotelDetails.HotelName ? response.HotelDetails.HotelName : 'N/A',
                "Guest House": response.HotelDetails.GuestHouse ? response.HotelDetails.GuestHouse : 'N/A',
                "Meal Preference": response.HotelDetails.MealPreference || 'N/A',
                "City": response.HotelDetails.City,
                "Location": response.HotelDetails.Location,
                "CheckIn Date": response.HotelDetails.CheckInDate ? moment(response.HotelDetails.CheckInDate,"YYYY-MM-DD").format("DD MMM YYYY"):'N/A',
                "CheckIn Time": response.HotelDetails.CheckInTime ? response.HotelDetails.CheckInTime:'N/A',
                "CheckOut Date": response.HotelDetails.CheckOutDate ? moment(response.HotelDetails.CheckOutDate,"YYYY-MM-DD").format("DD MMM YYYY"):'N/A',
                "CheckOut Time": response.HotelDetails.CheckOutTime ? response.HotelDetails.CheckOutTime : 'N/A',
                "Created On": moment(response.HotelDetails.CreatedAt).format("DD MMM YYYY"),
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
            'ICICI Hotel Queues',
            columnWidths
        );
        }
    }
   
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }
   
    onSearchSubmit() {
        this.getHotelQueue();
    }
   
    hide() {
        this.showConfirm = false;
        this.showReject=false;
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
                case 'request_ID': return this.utility.compare('' + a.HotelDetails.request_id, '' + b.HotelDetails.request_id, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.HotelDetails.ApprovalStatus, '' + b.HotelDetails.ApprovalStatus, isAsc);
                case 'approval_required': return this.utility.compare('' + a.HotelDetails.ApprovalRequired, '' + b.HotelDetails.ApprovalRequired, isAsc);
                case 'booking_Type': return this.utility.compare('' + a.HotelDetails.BookingType, '' + b.HotelDetails.BookingType, isAsc);
                case 'employee_name': return this.utility.compare('' + a.PaxDetails[0].FirstName, '' + b.PaxDetails[0].LastName, isAsc);
                case 'booking_Request_Type': return this.utility.compare('' + a.HotelDetails.BookingRequestType, '' + b.HotelDetails.BookingRequestType, isAsc);
                case 'booking_Request_Id': return this.utility.compare('' + a.HotelDetails.BookingRequestId, '' + b.HotelDetails.BookingRequestId, isAsc);
                case 'meal_preference': return this.utility.compare('' + a.HotelDetails.MealPreference, '' + b.HotelDetails.MealPreference, isAsc);
                case 'hotel_city': return this.utility.compare('' + a.HotelDetails.City, '' + b.HotelDetails.City, isAsc);
                case 'hotel_Location': return this.utility.compare('' + a.HotelDetails.Location, '' + b.HotelDetails.Location, isAsc);
                case 'checkInDate': return this.utility.compare('' + a.HotelDetails.CheckInDate, '' + b.HotelDetails.CheckInDate, isAsc);
                case 'checkInTime': return this.utility.compare('' + a.HotelDetails.CheckInTime, '' + b.HotelDetails.CheckInTime, isAsc);
                case 'checkOutDate': return this.utility.compare('' + a.HotelDetails.CheckOutDate, '' + b.HotelDetails.CheckOutDate, isAsc);
                case 'checkOutTime': return this.utility.compare('' + a.HotelDetails.CheckOutTime, '' + b.HotelDetails.CheckOutTime, isAsc);
                case 'guestHouse': return this.utility.compare('' + a.HotelDetails.GuestHouse, '' + b.HotelDetails.GuestHouse, isAsc);
                case 'hotelName': return this.utility.compare('' + a.HotelDetails.hotelName, '' + b.HotelDetails.hotelName, isAsc);
                case 'created_Date': return this.utility.compare('' + a.HotelDetails.CreatedAt, '' + b.HotelDetails.CreatedAt, isAsc);
                default: return 0;
            }
        });
    }
   
    showRejectReason(){
        this.showReject=true;
        this.cancellationRemark='';
    }
   
    deleteRequest() {
        if(this.cancellationRemark==''){
            return;
        }
        this.loading = true;
        this.showConfirm = false;
        this.apiHandlerService.apiHandler('iciciHotelDelete', 'POST', '', '', { id: this.deleteData.HotelDetails.id, cancellation_remark:this.cancellationRemark}).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Deleted successfully!!');
                this.getHotelQueue();
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
   
    confirmDelete(data) {
        this.showReject=false;
        this.cancellationRemark='';
        this.deleteData = data;
        this.showConfirm = true;
    }
   
    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            hotel_app_reference: '',
            hotel_booked_from_date: fromDate,
            hotel_booked_to_date: toDate,
            hotel_status: 'BOOKING_PENDING'
        });
        this.getHotelQueue();
    }

    updateHotelQueue(data:any){
        this.iciciHotelQueueUpdate.emit({ tabId: 'add_update_icici_hotel_queue', data });
        window.scroll({ 
                top: 0, 
                left: 0, 
                behavior: 'smooth' 
         });
    }
   
   

   copy(appReference) {
    this.reportsService.copy(appReference);
   }
   
    onSelectionChanged(event) {
    }

}
