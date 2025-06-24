import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Sort } from "@angular/material";
import { Router } from "@angular/router";
import { formatDate } from 'ngx-bootstrap/chronos';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ApiHandlerService } from "projects/student/src/app/core/api-handlers";
import { SwalService } from "projects/student/src/app/core/services/swal.service";
import { UtilityService } from "projects/student/src/app/core/services/utility.service";
import { Observable } from "rxjs";
import { SubSink } from "subsink";
import { ReportService } from "../../reports.service";
import { ViewCarBookingComponent } from "./components/view-car-booking/view-car-booking.component";

let filterArray: Array<any> = [];

@Component({
  selector: 'app-car-booking-report',
  templateUrl: './car-booking-report.component.html',
  styleUrls: ['./car-booking-report.component.scss']
})
export class CarBookingReportComponent implements OnInit {
    @Output() cabQueueUpdate = new EventEmitter<any>();
    searchType = 'car';
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    respDataCopy: any;
    filteredCorp: Observable<string[]>;
    showConfirm: boolean = false;
    isOpen = false as boolean;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    subjectName: string;
    loading: boolean = false;
    maxDate = new Date();
    deleteData: any = [];
    loadingTemplate: any;
    setMinDate: any;
    status:string="";
    cancellationRemark: string = '';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appReference', value: 'Application Reference' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: "no_of_guest", value: 'No Of Guest' },
        { key: 'cab_type', value: 'Cab Type' },
        { key: 'rental_city', value: 'Rental City' },
        { key: 'reporting_address', value: 'Reporting Address' },
        { key: 'date_of_requirement', value: 'Date Of Requirement' },
        { key: 'pickup_Time', value: 'Pickup Time' },
        { key: 'reporting_Time', value: 'Reporting Time' },
        { key: 'dropAddress', value: 'Drop Address' },
        { key: 'dropDate', value: 'Drop Date' },
        { key: 'dropTime', value: 'Drop Time' },
        { key: 'driver_Name', value: 'Driver Name' },
        { key: 'driver_Phone', value: 'Driver Mobile No.' },
        { key: 'booked_By', value: 'Booked By' },
        { key: 'usage', value: 'Usage' },
        { key: 'special_instructions', value: 'Special Instructions' },
        { key: 'created_Date', value: 'Created On' },
        { key: 'employee_cancellation_remark', value: 'Employee Cancellation Remark' },
        { key: 'cancellation_ts', value: 'Cancellation Requested Date' },
        { key: 'admin_cancellation_remark', value: 'Admin Cancellation Remark' },
        { key: 'admin_cancellation_ts', value: 'Admin Cancellation Date' },
        { key: 'cancellation_charge', value: 'Cancellation Charge' },
        { key: 'cancelled_by_id', value: 'Cancelled By' }
    ];
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService,
        private router: Router,
        private modalService: NgbModal,
        private reportsService:ReportService
    ) { }

    ngOnInit() {
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            cab_app_reference: new FormControl('', [Validators.maxLength(120)]),
            cab_status: new FormControl('ALL', [Validators.maxLength(120)]),
            cab_booked_from_date: new FormControl(fromDate, [Validators.maxLength(120)]),
            cab_booked_to_date: new FormControl(toDate, [Validators.maxLength(120)]),
        });
        this.getCarQueue();
    }

    getCarQueue() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "Status": this.regConfig.get('cab_status').value,
            "ApplicationReference": this.regConfig.get('cab_app_reference').value,
            "From": this.regConfig.get('cab_booked_from_date').value ? formatDate(this.regConfig.get('cab_booked_from_date').value, 'YYYY-MM-DD') : "",
            "To": this.regConfig.get('cab_booked_to_date').value ? formatDate(this.regConfig.get('cab_booked_to_date').value, 'YYYY-MM-DD') : ""
        }
        this.apiHandlerService.apiHandler('carFindAll', 'POST', '', '', reqBody).subscribe(res => {
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
            const filterOnFields = {
                status: objData.CarDetails.BookingStatus ? objData.CarDetails.BookingStatus : 'N/A',
                approvar_status: objData.CarDetails.BookingStatus ? objData.CarDetails.BookingStatus : 'N/A',
                no_of_guest: objData.NoOfPasseneger ? objData.NoOfPasseneger : 'N/A',
                cab_type: objData.CarDetails.VehicleType ? objData.CarDetails.VehicleType : 'N/A',
                rental_city: objData.CarDetails.City ? objData.CarDetails.City : 'N/A',
                date_of_requirement: objData.CarDetails.PickupDate ? objData.CarDetails.PickupDate : 'N/A',
                reporting_address: objData.CarDetails.PickupAddress ? objData.CarDetails.PickupAddress : 'N/A',
                reporting_Time: objData.CarDetails.ReportingTime ? objData.CarDetails.ReportingTime : 'N/A',
                pickup_Time: objData.CarDetails.PickupTime ? objData.CarDetails.PickupTime : 'N/A',
                dropAddress: objData.CarDetails.DropAddress ? objData.CarDetails.DropAddress : 'N/A',
                dropDate: objData.CarDetails.DropDate ? objData.CarDetails.DropDate : 'N/A',
                dropTime: objData.CarDetails.DropTime ? objData.CarDetails.DropTime : 'N/A',
                appReference: objData.AppReference,
                driver_Name: objData.CarDetails.DriverName ? objData.CarDetails.DriverName : 'N/A',
                driver_Phone: objData.CarDetails.DriverPhone ? objData.CarDetails.DriverPhone : 'N/A',
                booked_By: objData.CarDetails.BookedBy ? objData.CarDetails.BookedBy : 'N/A',
                usage: objData.CarDetails.Usage ? objData.CarDetails.Usage : 'N/A',
                special_instructions: objData.CarDetails.SpecialInstructionIfany ? objData.CarDetails.SpecialInstructionIfany : 'N/A',
                employee_cancellation_remark:objData.CarDetails.CancellationFeedback,
                cancellation_ts:objData.CarDetails.CancellationDate,
                admin_cancellation_remark:objData.CarDetails.CancelConfirmationFeedback,
                admin_cancellation_ts:objData.CarDetails.CancelConfirmationDate,
                cancellation_charge:objData.CarDetails.CancellationCharges,
                cancelled_by_id:objData.CarDetails.CancelledByName,
                created_Date: objData.created_Date ? objData.created_Date : 'N/A',
                trip_id:objData.CarDetails.TripId,
                trip_name:objData.CarDetails.TripName
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

    updateTrainQueue(data: any) {
        this.cabQueueUpdate.emit({ tabId: 'add_update_cab_queue', data });
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
                case 'status': return this.utility.compare('' + a.CarDetails.BookingStatus, '' + b.CarDetails.BookingStatus, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.CarDetails.BookingStatus, '' + b.CarDetails.BookingStatus, isAsc);
                case 'no_of_guest': return this.utility.compare('' + a.NoOfPasseneger, '' + b.NoOfPasseneger, isAsc);
                case 'cab_type': return this.utility.compare(+ a.CarDetails.VehicleType, + b.CarDetails.VehicleType, isAsc);
                case 'rental_city': return this.utility.compare(+ a.CarDetails.City, + b.CarDetails.City, isAsc);
                case 'date_of_requirement': return this.utility.compare(+ a.CarDetails.PickupDate, + b.CarDetails.PickupDate, isAsc);
                case 'reporting_address': return this.utility.compare(+ a.CarDetails.PickupAddress, + b.CarDetails.PickupAddress, isAsc);
                case 'reporting_Time': return this.utility.compare(+ a.CarDetails.ReportingTime, + b.CarDetails.ReportingTime, isAsc);
                case 'pickup_Time': return this.utility.compare(+ a.CarDetails.PickupTime, + b.CarDetails.PickupTime, isAsc);
                case 'dropAddress': return this.utility.compare(+ a.CarDetails.DropAddress, + b.CarDetails.DropAddress, isAsc);
                case 'dropDate': return this.utility.compare(+ a.CarDetails.DropDate, + b.CarDetails.DropDate, isAsc);
                case 'dropTime': return this.utility.compare(+ a.CarDetails.DropTime, + b.CarDetails.DropTime, isAsc);
                case 'appReference': return this.utility.compare(+ a.AppReference, + b.AppReference, isAsc);
                case 'driver_Name': return this.utility.compare(+ a.CarDetails.DriverName, + b.CarDetails.DriverName, isAsc);
                case 'driver_Phone': return this.utility.compare(+ a.CarDetails.DriverPhone, + b.CarDetails.DriverPhone, isAsc);
                case 'booked_By': return this.utility.compare(+ a.CarDetails.BookedBy, + b.CarDetails.BookedBy, isAsc);
                case 'usage': return this.utility.compare(+ a.CarDetails.Usage, + b.CarDetails.Usage, isAsc);
                case 'special_instructions': return this.utility.compare(+ a.CarDetails.special_instructions, + b.CarDetails.special_instructions, isAsc);
                case 'employee_cancellation_remark': return this.utility.compare(+ a.CarDetails.CancellationFeedback, + b.CarDetails.CancellationFeedback, isAsc);
                case 'cancellation_ts': return this.utility.compare(+ a.CarDetails.CancellationDate, + b.CarDetails.CancellationDate, isAsc);
                case 'admin_cancellation_remark': return this.utility.compare(+ a.CarDetails.CancelConfirmationFeedback, + b.CarDetails.CancelConfirmationFeedback, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.CarDetails.CancelConfirmationDate, + b.CarDetails.CancelConfirmationDate, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.CarDetails.CancellationCharges, + b.CarDetails.CancellationCharges, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.CarDetails.CancelledByName, + b.CarDetails.CancelledByName, isAsc);
                case 'created_Date': return this.utility.compare(+ a.CreatedAt, + b.CreatedAt, isAsc);
                case 'trip_id': return this.utility.compare(+ a.CarDetails.TripId, + b.CarDetails.TripId, isAsc);
                case 'trip_name': return this.utility.compare(+ a.CarDetails.TripName, + b.CarDetails.TripName, isAsc);

                default: return 0;
            }
        });
    }

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status=this.getFormtedStatus(response.CarDetails.BookingStatus);
            return {
                "Sl No.": index + 1,
                "Application Reference": response.AppReference,
                "Trip Id":response.CarDetails.TripId || 'N/A',
                "Trip Name":response.CarDetails.TripName || 'N/A',
                "Booking Status":status,
                "Approvar Status": response.CarDetails.ApprovalStatus || "PENDING",
                "No Of Guest": response.NoOfPasseneger ? response.NoOfPasseneger : 'N/A',
                "Cab Type": response.CarDetails.VehicleType ? response.CarDetails.VehicleType : 'N/A',
                "Rental City": response.CarDetails.City ? response.CarDetails.City : 'N/A',
                "Reporting Address": response.CarDetails.PickupAddress ? response.CarDetails.PickupAddress : 'N/A',
                "Date Of Requirement": response.CarDetails.PickupDate ? moment(response.CarDetails.PickupDate, "YYYY-MM-DD").format("DD MMM YYYY") : 'N/A',
                "Pickup Time": response.CarDetails.PickupTime ? response.CarDetails.PickupTime : 'N/A',
                "Reporting Time": response.CarDetails.ReportingTime ? response.CarDetails.ReportingTime : 'N/A',
                "Drop Address": response.CarDetails.DropAddress ? response.CarDetails.DropAddress : 'N/A',
                "Drop Date": response.CarDetails.DropDate ? moment(response.CarDetails.DropDate,"YYYY-MM-DD").format("DD MMM YYYY") : 'N/A',
                "Drop Time": response.CarDetails.DropTime ? response.CarDetails.DropTime : 'N/A',
                "Driver Name": response.CarDetails.DriverName ? response.CarDetails.DriverName : 'N/A',
                "Driver Mobile No.": response.CarDetails.DriverPhone ? response.CarDetails.DriverPhone : 'N/A',
                "Booked By": response.CarDetails.BookedBy ? response.CarDetails.BookedBy : 'N/A',
                "Usage": response.CarDetails.Usage ? response.CarDetails.Usage : 'N/A',
                "Special Instructions": response.CarDetails.SpecialInstructionIfany ? response.CarDetails.SpecialInstructionIfany : 'N/A',
                "Created On": moment(response.CreatedAt).format("DD MMM YYYY"),
                "Employee Cancellation Remark":response.CarDetails.CancellationFeedback|| 'N/A',
                "Cancellation Requested Date":response.CarDetails.CancellationDate ? moment(response.CarDetails.CancellationDate).format("DD MMM YYYY"):'N/A',
                "Admin Cancellation Remark":response.CarDetails.CancelConfirmationFeedback || 'N/A',
                "Admin Cancellation Date":response.CarDetails.CancelConfirmationDate ? moment(response.CarDetails.CancelConfirmationDate).format("DD MMM YYYY"):'N/A',
                "Cancellation Charge":response.CarDetails.CancellationCharges|| 'N/A',
                "Cancelled By":response.CarDetails.CancelledByName|| 'N/A',
               
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
            'Cab Report',
            columnWidths
        );
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    confirmDelete(data,status) {
        this.status=status;
        this.deleteData = data;
        this.showConfirm = true;
    }

    deleteRequest() {
        this.loading = true;
        this.showConfirm = false;
        this.apiHandlerService.apiHandler('deleteCar', 'POST', '', '', { id: this.deleteData.UserId }).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Deleted successfully!!');
                this.getCarQueue();
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

    onSearchSubmit() {
        this.getCarQueue();
    }

    onSelectionChanged(event) {
    }

    eticket(data: any) {
        const appReference = data.AppReference;
        this.router.navigate(['/reports/car-voucher'], { queryParams: { appReference } });
    }

    getInvoice(data: any){
        const appReference=data.AppReference;
        this.router.navigate(['/reports/car-invoice'], { queryParams: { appReference } });
      }

    hide() {
        this.showConfirm = false;
        this.cancellationRemark=""
    }

    copy(appReference) {
        this.reportsService.copy(appReference);
    }

    openModel(data: any) {
        const modalRef = this.modalService.open(ViewCarBookingComponent);
        modalRef.componentInstance.data = data;
    }

    cancelRequest() {
        this.loading = true;
        this.showConfirm = false;
        let payload={
            id: this.deleteData.UserId,
            CancellationFeedback:this.cancellationRemark,
            CancellationCharges:this.cancellationRemark
        }
        this.apiHandlerService.apiHandler('carCancel', 'POST', '', '', payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Cancelled successfully!!');
                this.getCarQueue();
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

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            cab_app_reference: '',
            cab_booked_from_date: fromDate,
            cab_booked_to_date: toDate,
            cab_status: 'ALL'
        });
        this.getCarQueue();
    }

}
