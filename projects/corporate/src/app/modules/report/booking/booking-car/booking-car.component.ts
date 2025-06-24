import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import * as moment from 'moment';
const log = new Logger('report/B2cCarComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];


@Component({
    selector: 'app-booking-car',
    templateUrl: './booking-car.component.html',
    styleUrls: ['./booking-car.component.scss']
})
export class BookingCarComponent implements OnInit, OnDestroy {

    private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue'
    };
    respDataCopy:any;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appReference', value: 'Application Reference' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Booking Status' },
        { key: 'app_status', value: 'Approvar Status' },
        // { key: 'company_name', value: 'Company Name' },
        { key: 'billing_entity', value: 'Billing Entity Name' },
        { key: "no_of_guest", value: 'No Of Guest' },
        { key: 'employee_code', value: 'Employee Code' },
        { key: 'mobile_number', value: 'Mobile Number' },
        { key: 'email', value: 'Email' },
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
        { key: 'employee_cancellation_remark', value: 'Employee Cancellation Remark' },
        { key: 'cancellation_ts', value: 'Cancellation Requested Date' },
        { key: 'admin_cancellation_remark', value: 'Admin Cancellation Remark' },
        { key: 'admin_cancellation_ts', value: 'Admin Cancellation Date' },
        { key: 'cancellation_charge', value: 'Cancellation Charge' },
        { key: 'cancelled_by_id', value: 'Cancelled By' },
        { key: 'created_Date', value: 'Created On' }
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'b2c-car-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    showModal: boolean;
    showCancelModal: boolean;
    currentRecord: any;
    paxDetails: any = [];

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private exportAsService: ExportAsService,
        private utility: UtilityService,
        private cdr:ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            phone_number: new FormControl('', [Validators.maxLength(15)]),
            app_reference: new FormControl('', [Validators.maxLength(15)]),
            pnr: new FormControl('', [Validators.maxLength(10)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });
        this.getCarQueue();
    }

    onSearchSubmit() {
        this.noData = true;
        this.respData = [];
        this.getCarQueue();
    }

    onReset() {
        this.regConfig.reset();
        if (!this.respData.length) {
            this.getCarQueue();
        }
    }
   
    getCarQueue() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "Status": this.regConfig.get('status').value,
            "ReservationCode":this.regConfig.get('app_reference').value,
            "BookedFromDate":this.regConfig.get('booked_from_date').value?formatDate(this.regConfig.get('booked_from_date').value, 'YYYY-MM-DD') : "",
            "BookedToDate":this.regConfig.get('booked_to_date').value?formatDate(this.regConfig.get('booked_to_date').value, 'YYYY-MM-DD') : "",
        }
        this.apiHandlerService.apiHandler('carById', 'POST', '', '', reqBody).subscribe(res => {
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
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }
    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = this.respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                status: objData.CarDetails.BookingStatus? objData.CarDetails.BookingStatus :'N/A',
                company_name: objData.CarDetails.CompanyName ? objData.CarDetails.CompanyName: 'N/A',
                trip_id: objData.CarDetails.TripId ? objData.CarDetails.TripId: 'N/A',
                trip_name: objData.CarDetails.TripName ? objData.CarDetails.TripName: 'N/A',
                billing_entity: objData.CarDetails.BillingEntityName ? objData.CarDetails.BillingEntityName :'N/A',
                app_status:objData.CarDetails.BookingStatus,
                no_of_guest: objData.NoOfPasseneger ? objData.NoOfPasseneger: 'N/A',
                employee_code: objData.CarDetails.EmployeeCode ? objData.CarDetails.EmployeeCode : 'N/A',
                mobile_number: objData.MobileNo ?  objData.MobileNo : 'N/A',
                email: objData.CarDetails.EmployeeEmail ? objData.CarDetails.EmployeeEmail : 'N/A',
                cab_type:objData.CarDetails.VehicleType ? objData.CarDetails.VehicleType : 'N/A',
                rental_city: objData.CarDetails.City ? objData.CarDetails.City : 'N/A',
                date_of_requirement: objData.CarDetails.PickupDate ? objData.CarDetails.PickupDate : 'N/A',
                reporting_address:objData.CarDetails.PickupAddress ? objData.CarDetails.PickupAddress : 'N/A',
                pickup_Time:objData.CarDetails.PickupTime ? objData.CarDetails.PickupTime : 'N/A',
                reporting_Time: objData.CarDetails.ReportingTime ? objData.CarDetails.ReportingTime : 'N/A',
                dropAddress: objData.CarDetails.DropAddress ? objData.CarDetails.DropAddress : 'N/A',
                dropDate: objData.CarDetails.DropDate ? objData.CarDetails.DropDate : 'N/A',
                dropTime: objData.CarDetails.DropTime ? objData.CarDetails.DropTime : 'N/A',
                appReference:objData.AppReference,
                driver_Name: objData.CarDetails.DriverName ? objData.CarDetails.DriverName : 'N/A',
                driver_Phone:objData.CarDetails.DriverPhone ? objData.CarDetails.DriverPhone : 'N/A',
                booked_By:objData.CarDetails.BookedBy ? objData.CarDetails.BookedBy : 'N/A',
                usage: objData.CarDetails.Usage ? objData.CarDetails.Usage : 'N/A',
                special_instructions:objData.CarDetails.SpecialInstructionIfany ? objData.CarDetails.SpecialInstructionIfany : 'N/A',
                employee_cancellation_remark:objData.CarDetails.CancellationFeedback,
                cancellation_ts:objData.CarDetails.CancellationDate,
                admin_cancellation_remark:objData.CarDetails.CancelConfirmationFeedback,
                admin_cancellation_ts:objData.CarDetails.CancelConfirmationDate,
                cancellation_charge:objData.CarDetails.CancellationCharges,
                cancelled_by_id:objData.CarDetails.CancelledById,
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
    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status=this.getFormtedStatus(response.CarDetails.BookingStatus);
            return {
                "Sl No.": index + 1,
                "Application Reference":response.AppReference,
                "TripId":response.CarDetails.TripId||'N/A',
                "TripName":response.CarDetails.TripName||'N/A',
                "Booking Status": response.CarDetails.BookingStatus? status :'N/A',
                "Approvar Status": response.CarDetails.ApprovalStatus || 'PENDING',
                // "Company Name": response.CarDetails.CompanyName ? response.CarDetails.CompanyName: 'N/A',
                "Billing Entity Name": response.CarDetails.BillingEntityName ? response.CarDetails.BillingEntityName :'N/A',
                "No Of The Guest": response.NoOfPasseneger ? response.NoOfPasseneger: 'N/A',
                "Employee Code": response.CarDetails.EmployeeCode ? response.CarDetails.EmployeeCode : 'N/A',
                "Mobile Number": response.MobileNo ?  response.MobileNo : 'N/A',
                "Email": response.CarDetails.EmployeeEmail ? response.CarDetails.EmployeeEmail : 'N/A',
                "Cab Type":response.CarDetails.VehicleType ? response.CarDetails.VehicleType : 'N/A',
                "Rental City": response.CarDetails.City ? response.CarDetails.City : 'N/A',
                "Reporting Address":response.CarDetails.PickupAddress ? response.CarDetails.PickupAddress : 'N/A',
                "Date Of Requirement": response.CarDetails.PickupDate ?  moment(response.CarDetails.PickupDate,"YYYY-MM-DD").format("MMM DD, YYYY") : 'N/A',
                "Pickup Time": response.CarDetails.PickupTime ? response.CarDetails.PickupTime : 'N/A',
                "Reporting Time": response.CarDetails.ReportingTime ? response.CarDetails.ReportingTime : 'N/A',
                "Drop Address": response.CarDetails.DropAddress ? response.CarDetails.DropAddress : 'N/A',
                "Drop Date": response.CarDetails.DropDate ?  moment(response.CarDetails.DropDate,"YYYY-MM-DD").format("MMM DD, YYYY") : 'N/A',
                "Drop Time": response.CarDetails.DropTime ? response.CarDetails.DropTime : 'N/A',
                "Driver Name": response.CarDetails.DriverName ? response.CarDetails.DriverName : 'N/A',
                "Driver Mobile No.":response.CarDetails.DriverPhone ? response.CarDetails.DriverPhone : 'N/A',
                "Booked By":response.CarDetails.BookedBy ? response.CarDetails.BookedBy : 'N/A',
                "Usage": response.CarDetails.Usage ? response.CarDetails.Usage : 'N/A',
                "Special Instructions":response.CarDetails.SpecialInstructionIfany ? response.CarDetails.SpecialInstructionIfany : 'N/A',
                "Employee Cancellation Remark":response.CarDetails.CancellationFeedback|| 'N/A',
                "Cancellation Requested Date":response.CarDetails.CancellationDate ? moment(response.CarDetails.CancellationDate).format("MMM DD, YYYY"):'N/A',
                "Admin Cancellation Remark":response.CarDetails.CancelConfirmationFeedback || 'N/A',
                "Admin Cancellation Date":response.CarDetails.CancelConfirmationDate ? moment(response.CarDetails.CancelConfirmationDate).format("MMM DD, YYYY"):'N/A',
                "Cancellation Charge":response.CarDetails.CancellationCharges|| 'N/A',
                "Cancelled By":response.CarDetails.CancelledById|| 'N/A',
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
            'Cab Report',
            columnWidths
        );
    }
    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'status': return this.utility.compare('' + a.CarDetails.BookingStatus, '' + b.CarDetails.BookingStatus, isAsc);
                case 'app_status': return this.utility.compare('' + a.CarDetails.BookingStatus, '' + b.CarDetails.BookingStatus, isAsc);
                case 'company_name': return this.utility.compare('' + a.CarDetails.CompanyName, '' + b.CarDetails.CompanyName, isAsc);
                case 'billing_entity': return this.utility.compare('' + a.CarDetails.BillingEntityName, '' + b.CarDetails.BillingEntityName, isAsc);
                case 'no_of_guest': return this.utility.compare('' + a.NoOfPasseneger , '' + b.NoOfPasseneger , isAsc);
                case 'employee_code': return this.utility.compare('' + a.CarDetails.EmployeeCode, '' + b.CarDetails.EmployeeCode, isAsc);
                case 'mobile_number': return this.utility.compare('' + a.MobileNo, '' + b.MobileNo, isAsc);
                case 'email': return this.utility.compare(+ a.CarDetails.EmployeeEmail , + b.CarDetails.EmployeeEmail, isAsc);
                case 'cab_type': return this.utility.compare(+ a.CarDetails.VehicleType, + b.CarDetails.VehicleType, isAsc);
                case 'rental_city': return this.utility.compare(+ a.CarDetails.City, + b.CarDetails.City, isAsc);
                case 'date_of_requirement': return this.utility.compare(+ a.CarDetails.PickupDate, + b.CarDetails.PickupDate, isAsc);
                case 'reporting_address': return this.utility.compare(+ a.CarDetails.PickupAddress, + b.CarDetails.PickupAddress, isAsc);
                case 'pickup_Time': return this.utility.compare(+ a.CarDetails.PickupTime, + b.CarDetails.PickupTime, isAsc);
                case 'reporting_Time': return this.utility.compare(+ a.CarDetails.ReportingTime, + b.CarDetails.ReportingTime, isAsc);
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
                case 'cancelled_by_id': return this.utility.compare(+ a.CarDetails.CancelledById, + b.CarDetails.CancelledById, isAsc);
                case 'created_Date': return this.utility.compare(+ a.CreatedAt, + b.CreatedAt, isAsc);
                default: return 0;
            }
        });
    }

    receiveSearchValues($event) {
        let resultData = [];
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                resultData = this.respData.filter(function (a) {
                    return Number(new Date(a.transactiondate).getTime()) >= Number(new Date($event.fromDate).getTime()) && Number(new Date(a.transactiondate).getTime()) <= Number(new Date($event.toDate).getTime())
                });
            } else if ($event.transactionId) {
                resultData = this.respData.filter(b => {
                    return b.app_refernce == $event.transactionId;
                })
            }
            this.respData = resultData;
            this.respDataCopy = [...this.respData];
            this.collectionSize = this.respDataCopy.length;
        } else {
            this.getCarQueue();
        }
    }

    download(type: SupportedExtensions, orientation?: string) {
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, `b2c-CarReport`).subscribe((_) => {
            // save started
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

    showPaxProfile(data) {
        this.showModal = true;
        this.currentRecord = data;
    }

    showCancelPolicy(data) {
        this.showCancelModal = true;
        this.currentRecord = data;
    }

    hide() {
        this.showModal = false;
        this.showCancelModal = false;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
