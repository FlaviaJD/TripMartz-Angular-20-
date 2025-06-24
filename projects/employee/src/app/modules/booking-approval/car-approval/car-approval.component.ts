import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiHandlerService } from '../../../core/api-handlers';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { UtilityService } from '../../../core/services/utility.service';
import { ReportService } from '../../reports/reports.service';
import { Router } from '@angular/router';
let filterArray: Array<any> = [];

@Component({
  selector: 'app-car-approval',
  templateUrl: './car-approval.component.html',
  styleUrls: ['./car-approval.component.scss']
})
export class CarApprovalComponent implements OnInit {

    searchText: string;
    respData: Array<any> = [];
    respDataCopy: any;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    loading: boolean = false;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appReference', value: 'Application Reference' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: "no_of_guest", value: 'No Of Guest' },
        { key: 'cab_type', value: 'Cab Type' },
        { key: 'rental_city', value: 'Rental City' },
        { key: 'reporting_address', value: 'Reporting Address' },
        { key: 'date_of_requirement', value: 'Date Of Requirement' },
        { key: 'pickup_Time', value: 'Pickup Time' },
        { key: 'dropAddress', value: 'Drop Address' },
        { key: 'dropDate', value: 'Drop Date' },
        { key: 'dropTime', value: 'Drop Time' },
        { key: 'booked_By', value: 'Booked By' },
        { key: 'usage', value: 'Usage' },
        { key: 'special_instructions', value: 'Special Instructions' },
        { key: 'created_Date', value: 'Created On' },
    ];

    constructor(
        private apiHandlerService: ApiHandlerService,
        private cdr:ChangeDetectorRef,
        private utility:UtilityService,
        private reportsService:ReportService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getCarPendingList();
    }

    getCarPendingList() {
        this.noData=true;
        this.respData=[];
        this.apiHandlerService.apiHandler('carPendingApprovalBookingList', 'POST', {},{},{}).subscribe(res => {
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
                approvar_status: objData.CarDetails.ApprovalStatus ? objData.CarDetails.ApprovalStatus : 'PENDING',
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.respData];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'approvar_status': return this.utility.compare('' + a.CarDetails.approvar_status, '' + b.CarDetails.approvar_status, isAsc);
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
                default: return 0;
            }
        });
    }

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,
                "Application Reference": response.AppReference,
                "Approval Status": response.CarDetails.ApprovalStatus || "PENDING",
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
                "Booked By": response.CarDetails.BookedBy ? response.CarDetails.BookedBy : 'N/A',
                "Usage": response.CarDetails.Usage ? response.CarDetails.Usage : 'N/A',
                "Special Instructions": response.CarDetails.SpecialInstructionIfany ? response.CarDetails.SpecialInstructionIfany : 'N/A',
                "Created On": moment(response.CreatedAt).format("DD MMM YYYY"),
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
   
    onSearchSubmit() {
        this.getCarPendingList();
    }

    onSelectionChanged(event) {
    }

    showTemplate(data){
        this.router.navigate(['/booking/car-approval-template'], { state: { data: data } });
    }
    

    copy(appReference) {
        this.reportsService.copy(appReference);
    }

}
