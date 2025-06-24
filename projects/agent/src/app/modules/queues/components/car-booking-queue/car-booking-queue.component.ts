import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/agent/src/app/core/api-handlers';
import { SwalService } from 'projects/agent/src/app/core/services/swal.service';
import { UtilityService } from 'projects/agent/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
let filterArray: Array<any> = [];

@Component({
    selector: 'app-car-booking-queue',
    templateUrl: './car-booking-queue.component.html',
    styleUrls: ['./car-booking-queue.component.scss']
})
export class CarBookingQueueComponent implements OnInit {
    @Output() cabQueueUpdate = new EventEmitter<any>();
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
    deleteData: any = [];
    loadingTemplate: any;
    setMinDate: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appReference', value: 'Application Reference' },
        { key: 'status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        // { key: 'company_name', value: 'Company Name' },
        // { key: 'billing_entity', value: 'Billing Entity Name' },
        { key: "no_of_guest", value: 'No Of Guest' },
        { key: 'employee_code', value: 'Employee Code' },
        { key: 'mobile_number', value: 'Mobile Number' },
        { key: 'email', value: 'Email' },
        { key: 'cab_type', value: 'Cab Type' },
        { key: 'rental_city', value: 'Rental City' },
        { key: 'reporting_address', value: 'Reporting Address' },
        { key: 'date_of_requirement', value: 'Travel Date' },
        { key: 'reporting_Time', value: 'Travel Time' },
        { key: 'dropAddress', value: 'Drop Address' },
        { key: 'dropDate', value: 'Drop Date' },
        { key: 'dropTime', value: 'Drop Time' },
        { key: 'driver_Name', value: 'Driver Name' },
        { key: 'driver_Phone', value: 'Driver Phone' },
        { key: 'booked_By', value: 'Booked By' },
        { key: 'usage', value: 'Usage' },
        { key: 'special_instructions', value: 'Special Instructions' },
        { key: 'created_Date', value: 'Created On' }
    ];
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService,
        private router: Router
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            cab_app_reference: new FormControl('', [Validators.maxLength(120)]),
            cab_status: new FormControl('BOOKING_PENDING', [Validators.maxLength(120)]),
            cab_booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            cab_booked_to_date: new FormControl('', [Validators.maxLength(120)]),
        });
        this.getCarQueue();
    }

    getCarQueue() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "booking_status": "BOOKING_PENDING"
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
                // company_name: objData.CarDetails.CompanyName ? objData.CarDetails.CompanyName : 'N/A',
                // billing_entity: objData.CarDetails.BillingEntityName ? objData.CarDetails.BillingEntityName : 'N/A',
                no_of_guest: objData.NoOfPasseneger ? objData.NoOfPasseneger : 'N/A',
                employee_code: objData.CarDetails.EmployeeCode ? objData.CarDetails.EmployeeCode : 'N/A',
                mobile_number: objData.MobileNo ? objData.MobileNo : 'N/A',
                email: objData.CarDetails.EmployeeEmail ? objData.CarDetails.EmployeeEmail : 'N/A',
                cab_type: objData.CarDetails.VehicleType ? objData.CarDetails.VehicleType : 'N/A',
                rental_city: objData.CarDetails.City ? objData.CarDetails.City : 'N/A',
                date_of_requirement: objData.CarDetails.PickupDate ? objData.CarDetails.PickupDate : 'N/A',
                reporting_address: objData.CarDetails.PickupAddress ? objData.CarDetails.PickupAddress : 'N/A',
                reporting_Time: objData.CarDetails.PickupTime ? objData.CarDetails.PickupTime : 'N/A',
                dropAddress: objData.CarDetails.DropAddress ? objData.CarDetails.DropAddress : 'N/A',
                dropDate: objData.CarDetails.DropDate ? objData.CarDetails.DropDate : 'N/A',
                dropTime: objData.CarDetails.DropTime ? objData.CarDetails.DropTime : 'N/A',
                appReference: objData.AppReference,
                driver_Name: objData.CarDetails.DriverName ? objData.CarDetails.DriverName : 'N/A',
                driver_Phone: objData.CarDetails.DriverPhone ? objData.CarDetails.DriverPhone : 'N/A',
                booked_By: objData.CarDetails.BookedBy ? objData.CarDetails.BookedBy : 'N/A',
                usage: objData.CarDetails.Usage ? objData.CarDetails.Usage : 'N/A',
                special_instructions: objData.CarDetails.SpecialInstructionIfany ? objData.CarDetails.SpecialInstructionIfany : 'N/A',
                created_Date: objData.created_Date ? objData.created_Date : 'N/A'
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
                // case 'company_name': return this.utility.compare('' + a.CarDetails.CompanyName, '' + b.CarDetails.CompanyName, isAsc);
                // case 'billing_entity': return this.utility.compare('' + a.CarDetails.BillingEntityName, '' + b.CarDetails.BillingEntityName, isAsc);
                case 'no_of_guest': return this.utility.compare('' + a.NoOfPasseneger, '' + b.NoOfPasseneger, isAsc);
                case 'employee_code': return this.utility.compare('' + a.CarDetails.EmployeeCode, '' + b.CarDetails.EmployeeCode, isAsc);
                case 'mobile_number': return this.utility.compare('' + a.MobileNo, '' + b.MobileNo, isAsc);
                case 'email': return this.utility.compare(+ a.CarDetails.EmployeeEmail, + b.CarDetails.EmployeeEmail, isAsc);
                case 'cab_type': return this.utility.compare(+ a.CarDetails.VehicleType, + b.CarDetails.VehicleType, isAsc);
                case 'rental_city': return this.utility.compare(+ a.CarDetails.City, + b.CarDetails.City, isAsc);
                case 'date_of_requirement': return this.utility.compare(+ a.CarDetails.PickupDate, + b.CarDetails.PickupDate, isAsc);
                case 'reporting_address': return this.utility.compare(+ a.CarDetails.PickupAddress, + b.CarDetails.PickupAddress, isAsc);
                case 'reporting_Time': return this.utility.compare(+ a.CarDetails.PickupTime, + b.CarDetails.PickupTime, isAsc);
                case 'dropAddress': return this.utility.compare(+ a.CarDetails.DropAddress, + b.CarDetails.DropAddress, isAsc);
                case 'dropDate': return this.utility.compare(+ a.CarDetails.DropDate, + b.CarDetails.DropDate, isAsc);
                case 'dropTime': return this.utility.compare(+ a.CarDetails.DropTime, + b.CarDetails.DropTime, isAsc);
                case 'appReference': return this.utility.compare(+ a.AppReference, + b.AppReference, isAsc);
                case 'driver_Name': return this.utility.compare(+ a.CarDetails.DriverName, + b.CarDetails.DriverName, isAsc);
                case 'driver_Phone': return this.utility.compare(+ a.CarDetails.DriverPhone, + b.CarDetails.DriverPhone, isAsc);
                case 'booked_By': return this.utility.compare(+ a.CarDetails.BookedBy, + b.CarDetails.BookedBy, isAsc);
                case 'usage': return this.utility.compare(+ a.CarDetails.Usage, + b.CarDetails.Usage, isAsc);
                case 'special_instructions': return this.utility.compare(+ a.CarDetails.special_instructions, + b.CarDetails.special_instructions, isAsc);
                case 'created_Date': return this.utility.compare(+ a.CreatedAt, + b.CreatedAt, isAsc);
                default: return 0;
            }
        });
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status=this.getFormtedStatus(response.CarDetails.BookingStatus);
            return {
                "Sl No.": index + 1,
                "Application Reference": response.AppReference,
                "Booking Status":status,
                "Approvar Status": status,
                // "Company Name": response.CarDetails.CompanyName ? response.CarDetails.CompanyName : 'N/A',
                // "Billing Entity Name": response.CarDetails.BillingEntityName ? response.CarDetails.BillingEntityName : 'N/A',
                "No Of Guest": response.NoOfPasseneger ? response.NoOfPasseneger : 'N/A',
                "Employee Code": response.CarDetails.EmployeeCode ? response.CarDetails.EmployeeCode : 'N/A',
                "Mobile Number": response.MobileNo ? response.MobileNo : 'N/A',
                "Email": response.CarDetails.EmployeeEmail ? response.CarDetails.EmployeeEmail : 'N/A',
                "Cab Type": response.CarDetails.VehicleType ? response.CarDetails.VehicleType : 'N/A',
                "Rental City": response.CarDetails.City ? response.CarDetails.City : 'N/A',
                "Reporting Address": response.CarDetails.PickupAddress ? response.CarDetails.PickupAddress : 'N/A',
                "Travel Date": response.CarDetails.PickupDate ? moment(response.CarDetails.PickupDate, "YYYY-MM-DD").format("MMM DD, YYYY") : 'N/A',
                "Travel Time": response.CarDetails.PickupTime ? response.CarDetails.PickupTime : 'N/A',
                "Drop Address": response.CarDetails.DropAddress ? response.CarDetails.DropAddress : 'N/A',
                "Drop Date": response.CarDetails.DropDate ? moment(response.CarDetails.DropDate,"YYYY-MM-DD").format("MMM DD, YYYY") : 'N/A',
                "Drop Time": response.CarDetails.DropTime ? response.CarDetails.DropTime : 'N/A',
                "Driver Name": response.CarDetails.DriverName ? response.CarDetails.DriverName : 'N/A',
                "Driver Phone": response.CarDetails.DriverPhone ? response.CarDetails.DriverPhone : 'N/A',
                "Booked By": response.CarDetails.BookedBy ? response.CarDetails.BookedBy : 'N/A',
                "Usage": response.CarDetails.Usage ? response.CarDetails.Usage : 'N/A',
                "Special Instructions": response.CarDetails.SpecialInstructionIfany ? response.CarDetails.SpecialInstructionIfany : 'N/A',
                "Created On": moment(response.CreatedAt).format("MMM DD, YYYY"),
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
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 }
        ];
        this.utility.exportToExcel(
            fileToExport,
            'Cab Queues',
            columnWidths
        );
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    confirmDelete(data) {
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

    eticket(data: any){
        this.router.navigateByUrl('queues/car-ticket');
        //this.router.navigate(['queues/train-ticket'], { queryParams: {  } });
      }

    hide() {
        this.showConfirm = false;
    }

    onReset() {
    }


}

