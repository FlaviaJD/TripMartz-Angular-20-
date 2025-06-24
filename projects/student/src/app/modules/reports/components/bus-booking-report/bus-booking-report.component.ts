import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiHandlerService } from "projects/student/src/app/core/api-handlers";
import { SwalService } from "projects/student/src/app/core/services/swal.service";
import { UtilityService } from "projects/student/src/app/core/services/utility.service";
import { Observable } from "rxjs/internal/Observable";
import { SubSink } from "subsink";
import { ReportService } from "../../reports.service";
import { Sort } from "@angular/material";
import * as moment from "moment";
import { ViewCarBookingComponent } from "../car-booking-report/components/view-car-booking/view-car-booking.component";
import { formatDate } from 'ngx-bootstrap/chronos';
let filterArray: Array<any> = [];
@Component({
  selector: 'app-bus-booking-report',
  templateUrl: './bus-booking-report.component.html',
  styleUrls: ['./bus-booking-report.component.scss']
})
export class BusBookingReportComponent implements OnInit {
    searchType = 'bus';
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
        { key: 'approvar_status', value: 'Approval Status' },
        { key: 'approvar_name', value: 'Approver Name' },
        { key: 'departure_date', value: 'Departure Date' },
        { key: 'arrival_date', value: 'Arrival Date' },
        { key: 'departure_from', value: 'Departure From' },
        { key: 'arrival_to', value: 'Arrival To' },
        { key: 'bus_type', value: 'Bus Type' },
        { key: 'operator', value: 'Operator' },
        { key: 'email', value: 'Email' },
        { key: 'name', value: 'Customer Name' },
        { key: 'pnr', value: 'PNR' },
        { key: 'ticket', value: 'Ticket' },
        { key: 'currency', value: 'Currency' },
        { key: 'totalFare', value: 'TotalFare' },
        { key: 'created_at', value: 'Booked On' }
    ];
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD/MM/YYYY',
        rangeInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    loggedInUser: any;

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
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            status: new FormControl('ALL', [Validators.maxLength(120)]),
            booked_from_date: new FormControl(fromDate, [Validators.maxLength(120)]),
            booked_to_date: new FormControl(toDate, [Validators.maxLength(120)]),
        });
        this.getBusReport();
    }

    getBusReport() {
        this.noData=true;
        this.respData=[];
        let reqBody = {
            "agent_id":'',
            "status": this.regConfig.get('status').value,
            "app_reference": this.regConfig.get('app_reference').value,
            "booked_from_date": this.regConfig.get('booked_from_date').value ? formatDate(this.regConfig.get('booked_from_date').value, 'YYYY-MM-DD') : "",
            "booked_to_date": this.regConfig.get('booked_to_date').value ? formatDate(this.regConfig.get('booked_to_date').value, 'YYYY-MM-DD') : "",
            "email":''
        }
        this.apiHandlerService.apiHandler('busReport', 'POST', '', '', reqBody).subscribe(res => {
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
                appReference: objData.app_reference ? objData.app_reference : 'N/A',
                trip_id: objData.trip_id ? objData.trip_id : 'N/A',
                trip_name: objData.trip_name ? objData.trip_name : 'N/A',
                status: objData.status ? objData.status : 'N/A',
                approvar_status: objData.approvar_status ? objData.approvar_status : 'N/A',
                approvar_name: objData.approvar_name ? objData.approvar_name : 'N/A',
                email: objData.email ? objData.email : 'N/A',
                name: objData.pax[0].name ? objData.pax[0].name : 'N/A',
                departure_date: objData.itinerary[0].departure_datetime ? objData.itinerary[0].departure_datetime : 'N/A',
                arrival_date: objData.itinerary[0].arrival_datetime ? objData.itinerary[0].arrival_datetime : 'N/A',
                departure_from: objData.itinerary[0].departure_from ? objData.itinerary[0].departure_from : 'N/A',
                arrival_to: objData.itinerary[0].arrival_to ? objData.itinerary[0].arrival_to : 'N/A',
                bus_type: objData.itinerary[0].bus_type ? objData.itinerary[0].bus_type : 'N/A',
                operator: objData.itinerary[0].operator ? objData.itinerary[0].operator : 'N/A',
                pnr: objData.pnr ? objData.pnr : 'N/A',
                ticket: objData.ticket ? objData.ticket : 'N/A',
                currency: objData.currency ? objData.currency : 'N/A',
                totalFare: objData.total_fare ? objData.total_fare : 'N/A',
                created_at: objData.itinerary[0].created_at ? objData.itinerary[0].created_at : 'N/A',
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

    convertDatetime(datetime) {
        if(datetime){
            return datetime.replace(/\.$/, '.000Z');
        }
    };

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...this.respData];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'appReference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'trip_id': return this.utility.compare('' + a.trip_id, '' + b.trip_id, isAsc);
                case 'trip_name': return this.utility.compare('' + a.trip_name, '' + b.trip_name, isAsc);
                case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'approvar_name': return this.utility.compare('' + a.approvar_name, '' + b.approvar_name, isAsc);
                case 'email': return this.utility.compare('' + a.name, '' + b.approvar_name, isAsc);
                case 'name': return this.utility.compare('' + a.pax[0].name, '' + b.pax[0].name, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.approvar_status, '' + b.approvar_status, isAsc);
                case 'departure_date': return this.utility.compare('' + a.itinerary[0].departure_datetime, '' + b.itinerary[0].departure_datetime, isAsc);
                case 'arrival_date': return this.utility.compare('' + a.itinerary[0].arrival_datetime, '' + b.itinerary[0].arrival_datetime, isAsc);
                case 'departure_from': return this.utility.compare('' + a.itinerary[0].departure_from, '' + b.itinerary[0].departure_from, isAsc);
                case 'arrival_to': return this.utility.compare('' + a.itinerary[0].arrival_to, '' + b.itinerary[0].arrival_to, isAsc);
                case 'bus_type': return this.utility.compare('' + a.itinerary[0].bus_type, '' + b.itinerary[0].bus_type, isAsc);
                case 'operator': return this.utility.compare('' + a.itinerary[0].operator, '' + b.itinerary[0].operator, isAsc);
                case 'pnr': return this.utility.compare('' + a.pnr, '' + b.pnr, isAsc);
                case 'ticket': return this.utility.compare('' + a.ticket, '' + b.ticket, isAsc);
                case 'currency': return this.utility.compare('' + a.currency, '' + b.currency, isAsc);
                case 'totalFare': return this.utility.compare('' + a.total_fare, '' + b.total_fare, isAsc);
                case 'created_at': return this.utility.compare('' + a.itinerary[0].created_at, '' + b.itinerary[0].created_at, isAsc);
                default: return 0;
            }
        });
    }

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            const status=this.getFormtedStatus(response.status);
            const departure_datetime=this.convertDatetime(response.itinerary[0].departure_datetime);
            const arrival_datetime=this.convertDatetime(response.itinerary[0].arrival_datetime);
            const created_at=this.convertDatetime(response.itinerary[0].created_at);
            return {
                "Sl No.": index + 1,
                "Application Reference": response.app_reference,
                "Trip Id": response.trip_id,
                "Trip Name": response.trip_name,
                "Booking Status": response.status,
                "Approval Status": response.approvar_status || 'PENDING',
                "Approved By":response.approverName|| 'N/A',
                "Departure Date": departure_datetime ? new Date(departure_datetime).toLocaleDateString("en-GB", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : '',
                "Arrival Date": arrival_datetime ? new Date(arrival_datetime).toLocaleDateString("en-GB", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : '',
                "Departure From": response.itinerary[0].departure_from,
                "Arrival To": response.itinerary[0].arrival_to,
                "Bus Type": response.itinerary[0].bus_type || 'N/A',
                "Operator": response.itinerary[0].operator,
                "Email": response.email,
                "PNR": response.pnr || 'N/A',
                "Ticket": response.ticket || 'N/A',
                "Currency": response.currency,
                "TotalFare": response.total_fare,
                "Booked On": created_at ? new Date(created_at).toLocaleDateString("en-GB", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : '',
            }
        });
            const columnWidths = [
                { wch: 5 }
            ];
        const fieldsLength = this.respData.length;
        for (let i = 0; i < fieldsLength; i++) {
            columnWidths.push({ wch: 30 })
        }
        this.loggedInUser = JSON.parse(localStorage.getItem('studentCurrentUser'));
        let value = this.loggedInUser.auth_role_id == 2 ? "Employee" : 'Staff'
        this.utility.exportToExcel(
            fileToExport,
            value+'-Bus Report',
            columnWidths
        );
        }
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    confirmCancel(data,status) {
        this.status=status;
        this.deleteData = data;
        this.showConfirm = true;
    }

    onSearchSubmit() {
        this.getBusReport();
    }

    onSelectionChanged(event) {
    }

    eticket(data: any) {
        const appReference = data.app_reference;
        this.router.navigate(['/search/bus/bus-voucher'], { queryParams: { appReference:appReference,booking_source:data.booking_source } });
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
            booking_source: this.deleteData.booking_source,
            AppReference:this.deleteData.app_reference,
        }
        this.apiHandlerService.apiHandler('buscancel', 'POST', '', '', payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Cancelled successfully!!');
                this.getBusReport();
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
            app_reference: '',
            booked_from_date: fromDate,
            booked_to_date: toDate,
            status: 'ALL'
        });
        this.getBusReport();
    }

}
