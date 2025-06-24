import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { formatDate } from 'ngx-bootstrap/chronos';
import { untilDestroyed } from '../../../core/services';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { ReportService } from '../../reports/reports.service';
import { SwalService } from '../../../core/services/swal.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsService } from 'ngx-export-as';
import { ApiHandlerService } from '../../../core/api-handlers';
import { HotelService } from '../../search/hotel/hotel.service';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-approval',
    templateUrl: './hotel-approval.component.html',
    styleUrls: ['./hotel-approval.component.scss']
})
export class HotelApprovalComponent implements OnInit {
    searchType = 'hotel';
    navLinks = [];
    pageSize = 10;
    loading: boolean = false;
    page = 1;
    collectionSize: number;
    deleteData: any = [];
    showConfirm: boolean = false;
    showData: any = [];
    status: string = "";
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    cancellationRemark: string = '';
    isTemplateClicked:boolean=false;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        // { key: 'book_now', value: 'Booking' },
        { key: 'request_id', value: 'Application Reference' },
        { key: 'approvestatus', value: 'Aprrovar Status' },
        { key: 'request_from', value: 'Request From' },
        { key: 'createdDatetime', value: 'Requested On' },
        { key: 'hotelName', value: 'Hotel Name' },
        { key: 'hotelCheckIn', value: 'CheckIn' },
        { key: 'hotelCheckOut', value: 'CheckOut' },
        { key: 'totalFare', value: 'Total Fare' },
    ];
    showDiv = {
        full: true,
        partial: false,
    }
    noData: boolean = true;
    respData: any;
    showPaxDetails: boolean;
    currentRecord: any = [];
    paxDetails: any = [];
    selectedRecord:any=[];
    hotels: any[];
    submitted: boolean=false;

    constructor(
        private reportsService: ReportService,
        private swalService: SwalService,
        private utility: UtilityService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private hotelService:HotelService,
        private cdr: ChangeDetectorRef,
        private apiHandlerService: ApiHandlerService,
    ) { 
        this.submitted=false;
        this.hotelService.loading.subscribe(res => {
            this.loading = res;
        });
       
        this.hotelService.hotels.subscribe(hotels => {
            this.hotels = hotels;
            if (this.submitted && this.hotels.length > 0) {
                this.router.navigate(['/booking/hotel-room-selection'], { queryParams: { appReference:this.selectedRecord.BookingDetails.request_id } });
                localStorage.setItem('selectedHotels', JSON.stringify(this.hotels));
            }
        })
        this.hotelService.noHotel.subscribe(res=>{
            if(res){
                this.swalService.alert.oops("No hotel found");
            }
        })
    }

    ngOnInit() {
        this.getBookingReports();
    }

    getBookingReports() {
        this.respData = [];
        let t = new Date()
        let fromDate = new Date(); // Current date
        fromDate.setFullYear(fromDate.getFullYear() - 1);
        let toDate = new Date(t.setDate(t.getDate() + 1))
        let reqBody = {
            "booked_from_date": fromDate ? formatDate(fromDate, 'YYYY-MM-DD') : "",
            "booked_to_date": toDate ? formatDate(toDate, 'YYYY-MM-DD') : "",
            "status": "APPROVAL_PENDING",
            "app_reference": "",
            "pnr": "",
            "email":  "",
        }
        this.reportsService.fetchHotelBookingReports(reqBody)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
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
                request_from:objData.BookingPaxDetails[0].FirstName,
                hotelName: objData.BookingDetails.HotelName,
                pnr: objData.BookingDetails.ConfirmationReference,
                totalFare: objData.BookingDetails.TotalFair,
                hotelCheckIn: objData.BookingDetails.HotelCheckIn,
                hotelCheckOut: objData.BookingDetails.HotelCheckOut,
                employee_cancellation_remark: objData.BookingDetails.employee_cancellation_remark,
                cancellation_ts: objData.BookingDetails.cancellation_ts,
                admin_cancellation_remark: objData.BookingDetails.admin_cancellation_remark,
                admin_cancellation_ts: objData.BookingDetails.admin_cancellation_ts,
                cancellation_charge: objData.BookingDetails.cancellation_charge,
                cancelled_by_id: objData.BookingDetails.cancelled_by_name,
                createdDatetime: objData.BookingDetails.CreatedDatetime,
                email: objData.BookingDetails.Email
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
                case 'pnr': return this.utility.compare('' + a.BookingDetails.ConfirmationReference, '' + b.BookingDetails.ConfirmationReference, isAsc);
                case 'totalFare': return this.utility.compare(+ a.BookingDetails.TotalFair, + b.BookingDetails.TotalFair, isAsc);
                case 'email': return this.utility.compare(+ a.BookingDetails.Email, + b.BookingDetails.Email, isAsc);
                case 'hotelCheckIn': return this.utility.compare('' + a.BookingDetails.HotelCheckIn.toLocaleLowerCase(), '' + b.BookingDetails.HotelCheckIn.toLocaleLowerCase(), isAsc);
                case 'hotelCheckOut': return this.utility.compare('' + a.BookingDetails.HotelCheckOut, '' + b.BookingDetails.HotelCheckOut, isAsc);
                case 'employee_cancellation_remark': return this.utility.compare(+ a.BookingDetails.employee_cancellation_remark, + b.BookingDetails.employee_cancellation_remark, isAsc);
                case 'cancellation_ts': return this.utility.compare(+ a.BookingDetails.cancellation_ts, + b.BookingDetails.cancellation_ts, isAsc);
                case 'admin_cancellation_remark': return this.utility.compare(+ a.BookingDetails.admin_cancellation_remark, + b.BookingDetails.admin_cancellation_remark, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.BookingDetails.admin_cancellation_ts, + b.BookingDetails.admin_cancellation_ts, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.BookingDetails.cancellation_charge, + b.BookingDetails.cancellation_charge, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.BookingDetails.cancelled_by_name, + b.BookingDetails.cancelled_by_name, isAsc);
                case 'createdDatetime': return this.utility.compare(+ a.BookingDetails.CreatedDatetime, + b.BookingDetails.CreatedDatetime, isAsc);
                default: return 0;
            }
        });
    }

    bookNow(data){
        this.loading=true;
        this.selectedRecord=data;
        this.submitted=true;
        let searchData=data.BookingDetails.SearchData.searchRequest;
        searchData.HotelCode=data.BookingDetails.HotelCode;
        searchData.AppReference=data.BookingDetails.AppReference;
        searchData.SearchType='approval';
        let currentUser = this.utility.readStorage('currentUser', localStorage);
        this.hotelService.proceedWithBooking(searchData,currentUser.id,currentUser);
    }

    copy(appReference) {
        this.reportsService.copy(appReference);
    }

    showTemplate(data){
        this.router.navigate(['/booking/hotel-approval-template'], { state: { data: data } });
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
        this.showConfirm = false
    }

    exportExcel(): void {
        if (this.respData && this.respData.length > 0) {
            const fileToExport = this.respData.map((response: any, index: number) => {
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.BookingDetails.request_id || 'N/A',
                    "Aprrovar Status":response.BookingDetails.approvar_status || 'PENDING',
                    "Request From":response.BookingPaxDetails[0].FirstName,
                    "Requested On": moment(response.BookingDetails.CreatedDatetime).format("DD MMM YYYY"),
                    "Hotel Name": response.BookingDetails.HotelName,
                    "CheckIn": moment(response.BookingDetails.HotelCheckIn).format("DD MMM YYYY"),
                    "CheckOut": moment(response.BookingDetails.HotelCheckOut).format("DD MMM YYYY"),
                    "Total Fare": response.BookingDetails.TotalFair,
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
                'Hotel Report',
                columnWidths
            );
        }
    }

    confirmDelete(data, status) {
        this.deleteData = data;
        this.showConfirm = true;
        this.cancellationRemark = '';
        this.status = status;
    }

    ngOnDestroy() { 
        this.submitted=false;
        this.hotelService.noHotel.next(false);
    }

}


