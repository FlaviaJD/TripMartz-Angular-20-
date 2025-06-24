import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ReportService } from '../../reports.service';
import { SwalService } from '../../../../core/services/swal.service';
import { untilDestroyed } from '../../../../core/services';
import { Logger } from '../../../../core/logger/logger.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';

const log = new Logger('report/BookingDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-hotel-booking-report',
    templateUrl: './hotel-booking-report.component.html',
    styleUrls: ['./hotel-booking-report.component.scss']
})
export class HotelBookingReportComponent implements OnInit, OnDestroy {
    searchType = 'hotel';
    navLinks = [];
    pageSize = 10;
    loading: boolean = false;
    page = 1;
    collectionSize: number;
    deleteData: any = [];
    showConfirm: boolean = false;
    showData: any=[];
    status: string = "";
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    cancellationRemark: string = '';
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'request_id', value: 'Application Reference' },
        // { key: 'invoice_no', value: 'Invoice No' },
        // { key: 'trip_id', value: 'Trip Id' },
        // { key: 'trip_name', value: 'Trip Name' },
        { key: 'hotelName', value: 'Hotel Name' },
        { key: 'status', value: 'Booking Status' },
        // { key: 'approvestatus', value: 'Approval Status' },
        // { key: 'approverName', value: 'Approvar Name' },
        // { key: 'approvar_stage_two',value:'Level Two Approval'},
        { key: 'pnr', value: 'Confirmation Number' },
        { key: 'totalFare', value: 'Total Fare' },
        { key: 'email', value: 'Email' },
        { key: 'name', value: 'Customer Name' },
        { key: 'hotelCheckIn', value: 'CheckIn' },
        { key: 'hotelCheckOut', value: 'CheckOut' },
        { key: 'createdDatetime', value: 'Booked On' },
        // { key: 'employee_cancellation_remark', value: 'Employee Cancellation Remark' },
        // { key: 'cancellation_ts', value: 'Cancellation Requested Date' },
        // { key: 'admin_cancellation_remark', value: 'Admin Cancellation Remark' },
        // { key: 'admin_cancellation_ts', value: 'Admin Cancellation Date' },
        // { key: 'cancellation_charge', value: 'Cancellation Charge' },
        // { key: 'cancelled_by_id', value: 'Cancelled By' },
    ];

    showDiv = {
        full : true,
        partial : false,
      }

    noData: boolean = true;
    respData: any;
    showPaxDetails: boolean;
    currentRecord: any = [];
    paxDetails: any = [];
    loggedInUser: any;

    constructor(
        private reportsService: ReportService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private cdr: ChangeDetectorRef,
        private apiHandlerService: ApiHandlerService,
    ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(q => {
            if (!this.utility.isEmpty(q)) {
                this.getBookingReports({ app_reference: q.appRef })
            }
        });
    }

    receiveSearchValues($event) {
        this.noData = true;
        this.respData = [];
        this.getBookingReports($event);
    }

    getBookingReports(searchForm) {
        this.respData = [];
        this.cdr.detectChanges();
        let t = new Date(searchForm.booked_to_date)
        let toDate = new Date(t.setDate(t.getDate() + 1))
        let reqBody = {
            "booked_from_date": searchForm.booked_from_date ? formatDate(searchForm.booked_from_date, 'YYYY-MM-DD') : "",
            "booked_to_date": searchForm.booked_to_date ? formatDate(toDate, 'YYYY-MM-DD') : "",
            "status": searchForm.status || "",
            "app_reference": searchForm.app_reference || "",
            "pnr": searchForm.pnr || "",
            "email": searchForm.email || "",
        }
        this.reportsService.fetchHotelBookingReports(reqBody)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug(resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                    this.cdr.detectChanges();
                } else {
                    this.noData = false;
                    this.respData = [];
                    this.cdr.detectChanges();
                }
            }, (err) => {
                this.respData = [];
                this.noData = false;
                this.cdr.detectChanges();
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                request_id: objData.BookingDetails.request_id,
                hotelName: objData.BookingDetails.HotelName,
                trip_id:objData.BookingDetails.trip_id,
                trip_name:objData.BookingDetails.trip_name,
                status: objData.BookingDetails.Status,
                name: objData.BookingDetails.Name,
                pnr: objData.BookingDetails.ConfirmationReference,
                totalFare: objData.BookingDetails.TotalFair,
                approvestatus: objData.BookingDetails.approvar_status,
                approverName: objData.BookingDetails.approvar_name,
                hotelCheckIn: objData.BookingDetails.HotelCheckIn,
                hotelCheckOut: objData.BookingDetails.HotelCheckOut,
                employee_cancellation_remark:objData.BookingDetails.employee_cancellation_remark,
                cancellation_ts:objData.BookingDetails.cancellation_ts,
                admin_cancellation_remark:objData.BookingDetails.admin_cancellation_remark,
                admin_cancellation_ts:objData.BookingDetails.admin_cancellation_ts,
                cancellation_charge:objData.BookingDetails.cancellation_charge,
                cancelled_by_id:objData.BookingDetails.cancelled_by_name,
                createdDatetime: objData.BookingDetails.CreatedDatetime,
                invoice_no:objData.BookingDetails.DomainOrigin,
                email: objData.BookingDetails.Email,
                approvar_stage_two:objData.BookingDetails.approvar_stage_two
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];
    }

    getTripId(value) {
        let response = JSON.parse(value);
        return response.searchRequest.TripId;
    }

    getTripValue(value) {
        let response = JSON.parse(value);
        return response.searchRequest.TripValue;
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'request_id': return this.utility.compare('' + a.BookingDetails.request_id, '' + b.BookingDetails.request_id, isAsc);
                case 'hotelName': return this.utility.compare('' + a.BookingDetails.HotelName, '' + a.BookingDetails.HotelName, isAsc);
                case 'trip_id': return this.utility.compare('' + a.BookingDetails.trip_id, '' + a.BookingDetails.trip_id, isAsc);
                case 'trip_name': return this.utility.compare('' + a.BookingDetails.trip_name, '' + a.BookingDetails.trip_name, isAsc);
                case 'name': return this.utility.compare('' + a.BookingDetails.Name.toLocaleLowerCase(), '' + b.BookingDetails.Name.toLocaleLowerCase(), isAsc);
                case 'status': return this.utility.compare('' + a.BookingDetails.Status.toLocaleLowerCase(), '' + b.BookingDetails.Status.toLocaleLowerCase(), isAsc);
                case 'pnr': return this.utility.compare('' + a.BookingDetails.ConfirmationReference, '' + b.BookingDetails.ConfirmationReference, isAsc);
                case 'totalFare': return this.utility.compare(+ a.BookingDetails.TotalFair, + b.BookingDetails.TotalFair, isAsc);
                case 'email': return this.utility.compare(+ a.BookingDetails.Email, + b.BookingDetails.Email, isAsc);
                case 'approverName': return this.utility.compare(+ a.BookingDetails.approvar_name, + b.BookingDetails.approvar_name, isAsc);
                case 'hotelCheckIn': return this.utility.compare('' + a.BookingDetails.HotelCheckIn.toLocaleLowerCase(), '' + b.BookingDetails.HotelCheckIn.toLocaleLowerCase(), isAsc);
                case 'hotelCheckOut': return this.utility.compare('' + a.BookingDetails.HotelCheckOut, '' + b.BookingDetails.HotelCheckOut, isAsc);
                case 'employee_cancellation_remark': return this.utility.compare(+ a.BookingDetails.employee_cancellation_remark, + b.BookingDetails.employee_cancellation_remark, isAsc);
                case 'cancellation_ts': return this.utility.compare(+ a.BookingDetails.cancellation_ts, + b.BookingDetails.cancellation_ts, isAsc);
                case 'admin_cancellation_remark': return this.utility.compare(+ a.BookingDetails.admin_cancellation_remark, + b.BookingDetails.admin_cancellation_remark, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.BookingDetails.admin_cancellation_ts, + b.BookingDetails.admin_cancellation_ts, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.BookingDetails.cancellation_charge, + b.BookingDetails.cancellation_charge, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.BookingDetails.cancelled_by_name, + b.BookingDetails.cancelled_by_name, isAsc);
                case 'createdDatetime': return this.utility.compare(+ a.BookingDetails.CreatedDatetime, + b.BookingDetails.CreatedDatetime, isAsc);
                case 'invoice_no': return this.utility.compare(+ a.BookingDetails.DomainOrigin, + b.BookingDetails.DomainOrigin, isAsc);
                case 'approvar_stage_two': return this.utility.compare(+ a.BookingDetails.approvar_stage_two, + b.BookingDetails.approvar_stage_two, isAsc);
                default: return 0;
            }
        });
    }

    copy(appReference) {
        this.reportsService.copy(appReference);
    }

    getVoucher(appReference) {
        this.router.navigate(['/reports/hotel-voucher'], { queryParams: { appReference } });
    }

    getInvoice(appReference) {
        this.router.navigate(['/reports/hotel-invoice'], { queryParams: { appReference } });
    }

    showPaxProfile(data) {
        this.showPaxDetails = true;
        this.currentRecord = data.BookingDetails;
        this.paxDetails = data.BookingPaxDetails.filter(p => p.LeadPax);
        this.paxDetails = this.paxDetails[0];
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    hide() {
        this.showPaxDetails = false;
        this.showConfirm=false
    }

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
            const fileToExport = this.respData.map((response: any, index: number) => {
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.BookingDetails.request_id || 'N/A',
                    // "Invoice No":response.BookingDetails.DomainOrigin || 'N/A',
                    "Trip Id":response.BookingDetails.trip_id || 'N/A',
                    "Trip Name":response.BookingDetails.trip_name|| 'N/A',
                    "Hotel Name": response.BookingDetails.HotelName,
                    "Status": this.getFormtedStatus(response.BookingDetails.Status),
                    // "Level Two Approval": response.BookingDetails.approvar_stage_two || 'N/A',
                    "Approval Status": response.BookingDetails.approvar_status || 'N/A',
                    "Approver Name": response.BookingDetails.approvar_name || 'N/A',
                    "Confirmation Number": response.BookingDetails.ConfirmationReference ? response.BookingDetails.ConfirmationReference : 'N/A',
                    "Total Fare": response.BookingDetails.TotalFair,
                    "Email": response.BookingDetails.Email,
                    "Customer Name": response.BookingDetails.Name,
                    "CheckIn": moment(response.BookingDetails.HotelCheckIn).format("DD MMM YYYY"),
                    "CheckOut": moment(response.BookingDetails.HotelCheckOut).format("DD MMM YYYY"),
                    "Booked On": moment(response.BookingDetails.CreatedDatetime).format("DD MMM YYYY"),
                    // "Employee Cancellation Remark": response.BookingDetails.employee_cancellation_remark || 'N/A',
                    // "Cancellation Requested Date": response.BookingDetails.cancellation_ts ? moment(response.BookingDetails.cancellation_ts).format("DD MMM YYYY") : 'N/A',
                    // "Admin Cancellation Remark": response.BookingDetails.admin_cancellation_remark || 'N/A',
                    // "Admin Cancellation Date": response.BookingDetails.admin_cancellation_ts ? moment(response.BookingDetails.admin_cancellation_ts).format("DD MMM YYYY") : 'N/A',
                    // "Cancellation Charge": response.BookingDetails.cancellation_charge || 'N/A',
                    // "Cancelled By": response.BookingDetails.cancelled_by_name || 'N/A',

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
                value+'-Hotel Report',
                columnWidths
            );
        }
    }

    confirmDelete(data,status) {
        this.deleteData = data;
        this.showConfirm = true;
        this.cancellationRemark='';
        this.status=status;
    }

    cancelRequest() {
        if (this.cancellationRemark.trim() === "") {
            this.cancellationRemark='';
            return;
        }
        this.loading = true;
        this.showConfirm = false;
        let payload={
            AppReference: this.deleteData.BookingDetails.AppReference,
            cancellationRemarks:this.cancellationRemark,
            booking_source:this.deleteData.BookingDetails.SearchData.searchRequest.booking_source
        }
        this.apiHandlerService.apiHandler('hotelCancel', 'POST', '', '', payload).subscribe(res => {
            if (res && ([200, 201].includes(res.statusCode)) && res.data) {
                this.loading = false;
                this.swalService.alert.success('Cancelled successfully!!');
                this.getDetails();
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

    getDetails(){
        let fromDate=this.utility.setFromDate();
        let toDate=this.utility.setToDate();
        let request={
            "booked_from_date": fromDate,
            "booked_to_date": toDate,
            "status": "ALL",
            "app_reference": null,
            "email": null
        }
        this.getBookingReports(request);

    }

    ngOnDestroy() { }

}
