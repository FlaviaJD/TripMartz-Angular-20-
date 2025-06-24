import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Sort } from '@angular/material';
import { ApiHandlerService } from '../../../../../core/api-handlers';
import { Logger } from '../../../../../core/logger/logger.service';
import { SwalService } from '../../../../../core/services/swal.service';
import { UtilityService } from '../../../../../core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('report/B2cHotelComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-corporate-hotel',
    templateUrl: './corporate-hotel.component.html',
    styleUrls: ['./corporate-hotel.component.scss']
})
export class CorporateHotelComponent implements OnInit {
    private subSunk = new SubSink();
    regConfig: FormGroup;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    corporateList: Array<any> = []; 
    corporateId: string='';
    pageSize = 100;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        // { key: 'appReference', value: 'Application Reference' },
        { key: 'request_id', value: 'Application Reference' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        // { key: 'invoice_no', value: 'Invoice No' },
        { key: 'status', value: 'Status' },
        { key: 'app_status', value: 'Approvar Status' },
        { key: 'app_name', value: 'Approvar Name' },
        { key: 'corporateName', value: 'Corporate Name' },
        // { key: 'approvar_stage_two',value:'Level Two Approval'},
        // { key: 'type', value: 'Booking Type' },
        { key: 'hotelName', value: 'Hotel Name' },
        { key: 'check_inDate', value: 'Check-in Date' },
        { key: 'Check_outDate', value: 'Check-out Date' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'leadPassengerName', value: 'Lead Passenger Name' },
        { key: 'phoneNumber', value: 'Lead Passenger Phone No.' },
        { key: 'email', value: 'Lead Passenger Email' },
        { key: 'booked_by', value: 'Booked By' },
        { key: 'request_created_date', value:'Request Created Date'},
        { key: 'booking_confirmation_date', value:'Booking Confirmation Date'},
         // { key: 'payment_mode', value: 'Payment Mode' },
        // { key: 'admin_cancellation_ts', value: 'Admin Cancellation Date' },
        // { key: 'cancellation_charge', value: 'Cancellation Charge' },
        // { key: 'cancelled_by_id', value: 'Cancelled By' },
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal: boolean;
    showCancelModal: boolean;
    currentRecord: any = [];
    paxDetails: any = [];
    searchText: string = "";
    maxDate = new Date();
    filteredCorp: Observable<string[]>;
    deleteData: any = [];
    status: string = "";
    showConfirm: boolean = false;
    loggedInUser: any;

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
         this.getClientList();
        let fromDate = this.utility.setFromDate();
        let tommorow = this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            phone_number: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
            corporate: new FormControl('', [Validators.maxLength(120)]),
        });
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        });
        this.setCorporate();
        this.getHotelReport();
    }


    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onValueChange(value){
        if(value==''){
            this.corporateId='';
        }
  }

    onSearchSubmit() {
        this.getHotelReport();
    }


    setCorporate() {
        this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    

    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let tommorow = this.utility.setToDate();
        this.regConfig.patchValue({
            status: 'ALL',
            booked_from_date: fromDate,
            booked_to_date: tommorow
        });
        this.searchText = "";
        this.getHotelReport();
    }

    getHotelReport() {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'),
                "booked_to_date": formatDate(this.regConfig.value.booked_to_date, 'YYYY-MM-DD'),
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "pnr": this.regConfig.value.pnr || "",
                "email": this.regConfig.value.email || "",
                "auth_role_id":7,
                "corporate_id":this.corporateId,
                

            }
        } else {
            reqBody = {}
        } this.subSunk.sink = this.apiHandlerService.apiHandler('b2bHotelReport', 'post', {}, {}, reqBody).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                this.noData = false;
                this.respData = resp.data || [];
                respDataCopy = [...this.respData];
                this.collectionSize = respDataCopy.length;
            }
            else {
                this.noData = false;
                this.respData = [];
            }
        }, (err) => {
            this.noData = false;
            this.respData = [];
        });
    }

     getClientList() {
                this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
                    { "status": 1, "auth_role_id": GlobalConstants.CORPORATE_AUTH_ROLE_ID })
                    .subscribe(resp => {
                        if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                            this.corporateList = resp.data || [];
                            this.setCorporate();
                        }
                    }, (err: HttpErrorResponse) => {
                        this.swalService.alert.error(err['error']['Message']);
                    });
            }

     onSelectionChanged(event) {
        this.corporateId= event.option.id;
    }

   _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter(option => (option.business_name + ' (' + option.uuid + ')').toLowerCase().includes(filterValue));
    }

    noOfNights(i, o) {
        return this.utility.calculateDiff(i, o);
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                type: objData.BookingDetails.BookingType,
                // appReference: objData.BookingDetails.AppReference,
                trip_id:objData.BookingDetails.trip_id,
                trip_name:objData.BookingDetails.trip_name,
                request_id: objData.BookingDetails.request_id,
                status: objData.BookingDetails.Status,
                app_name: objData.BookingDetails.approvarName,
                approvar_stage_two:objData.BookingDetails.approvar_stage_two,
                corporateName: objData.BookingDetails.company_name,
                hotelName: objData.BookingDetails.HotelName,
                check_inDate: objData.BookingDetails.HotelCheckIn,
                Check_outDate: objData.BookingDetails.HotelCheckOut,
                total_fare: objData.BookingDetails.TotalFair,
                leadPassengerName:objData['BookingPaxDetails'][0]['FirstName'],
                phoneNumber:objData.BookingDetails.PhoneNumber,
                email:objData.BookingDetails.email,
                booked_by:objData.BookingDetails.booked_by,
                request_created_date:objData.BookingDetails.request_created_date,
                booking_confirmation_date:objData.BookingDetails.booking_confirmation_date,
                admin_cancellation_ts:objData.BookingDetails.admin_cancellation_ts,
                // payment_mode: objData.BookingDetails.PaymentMode,
                cancellation_charge:objData.BookingDetails.cancellation_charge,
                cancelled_by_id:objData.BookingDetails.cancelled_by_name,
                invoice_no:objData.BookingDetails.domain_origin
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
                case 'type': return this.utility.compare('' + a.BookingDetails.BookingType, '' + b.BookingDetails.BookingType, isAsc);
                // case 'appReference': return this.utility.compare('' + a.BookingDetails.AppReference, '' + b.BookingDetails.AppReference, isAsc);
                case 'trip_id': return this.utility.compare('' + a.BookingDetails.trip_id.toLocaleLowerCase(), '' + b.BookingDetails.trip_id.toLocaleLowerCase(), isAsc);
                case 'trip_name': return this.utility.compare('' + a.BookingDetails.trip_name.toLocaleLowerCase(), '' + b.BookingDetails.trip_name.toLocaleLowerCase(), isAsc);
                case 'approvar_stage_two': return this.utility.compare(+ a.BookingDetails.approvar_stage_two, + b.BookingDetails.approvar_stage_two, isAsc);
                case 'approver_name': return this.utility.compare(+ a.BookingDetails.approvarName, + b.BookingDetails.approvarName, isAsc);
                case 'status': return this.utility.compare('' + a.BookingDetails.Status.toLocaleLowerCase(), '' + b.BookingDetails.Status.toLocaleLowerCase(), isAsc);
                case 'request_id': return this.utility.compare('' + a.BookingDetails.request_id, '' + b.BookingDetails.request_id, isAsc);
                case 'corporateName': return this.utility.compare('' + a.BookingDetails.company_name, '' + b.BookingDetails.company_name, isAsc);
                case 'hotelName': return this.utility.compare(+ a.BookingDetails.HotelName, + b.BookingDetails.HotelName, isAsc);
                case 'check_inDate': return this.utility.compare(+ a.BookingDetails.HotelCheckIn, + b.BookingDetails.HotelCheckIn, isAsc);
                case 'Check_outDate': return this.utility.compare(+ a.BookingDetails.HotelCheckOut, + b.BookingDetails.HotelCheckOut, isAsc);
                case 'total_fare': return this.utility.compare(+ a.BookingDetails.TotalFair, + b.BookingDetails.TotalFair, isAsc);
                case 'leadPassengerName': return this.utility.compare(+ a['BookingPaxDetails'][0]['FirstName'], + b['BookingPaxDetails'][0]['LastName'], isAsc);
                case 'phoneNumber': return this.utility.compare(+ a.BookingDetails.PhoneNumber, + b.BookingDetails.PhoneNumber, isAsc);
                case 'email': return this.utility.compare(+ a.BookingDetails.Email, + b.BookingDetails.Email, isAsc);
                case 'booked_by': return this.utility.compare(+ a.BookingDetails.booked_by, + b.BookingDetails.booked_by, isAsc);
                case 'request_created_date': return this.utility.compare(+ a.BookingDetails.request_created_date, + b.BookingDetails.request_created_date, isAsc);
                case 'booking_confirmation_date': return this.utility.compare(+ a.BookingDetails.booking_confirmation_date, + b.BookingDetails.booking_confirmation_date, isAsc);
                // case 'payment_mode': return this.utility.compare(+ a.BookingDetails.PaymentMode, + b.BookingDetails.PaymentMode, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.BookingDetails.admin_cancellation_ts, + b.BookingDetails.admin_cancellation_ts, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.BookingDetails.cancellation_charge, + b.BookingDetails.cancellation_charge, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.BookingDetails.cancelled_by_name, + b.BookingDetails.cancelled_by_name, isAsc);
                case 'invoice_no': return this.utility.compare(+ a.BookingDetails.domain_origin, + b.BookingDetails.domain_origin, isAsc);
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
            respDataCopy = [...this.respData];
            this.collectionSize = respDataCopy.length;
        } else {
            this.getHotelReport();
        }
    }

    showPaxProfile(data) {
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.BookingPaxDetails.filter(x => {
            return x.LeadPax == true
        });
        this.paxDetails = this.paxDetails[0];
    }

    hide() {
        this.showModal = false;
        this.showCancelModal = false;
        this.showConfirm = false
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            let name='';
            const pax = response.BookingPaxDetails.length > 0 ? response.BookingPaxDetails[0] : null;
            if (pax && pax.FirstName && pax.LastName) {
                name = pax.FirstName + ' ' + pax.LastName;
            } 
            return {
                "Sl No.": index + 1,
                // "Application Reference": response.BookingDetails.AppReference,
                "Application Reference": response.BookingDetails.request_id || 'N/A',
                "Trip Id":response.BookingDetails.trip_id || 'N/A',
                "Trip Name":response.BookingDetails.trip_name || 'N/A',
                "Status": this.getFormtedStatus(response.BookingDetails.Status),
                "Approvar Status":response.BookingDetails.approvar_status|| 'Pending',
                "Approvar Name":response.BookingDetails.approverName || 'N/A',
                "Corporate Name": response.BookingDetails.company_name || 'N/A',
                // "Level Two Approval": response.BookingDetails.approvar_stage_two || 'N/A',
                // "Booking Type": response.BookingDetails.BookingType ? response.BookingDetails.BookingType : 'N/A',
                "Hotel Name": response.BookingDetails.HotelName,
                "Check-in Date": response.BookingDetails.HotelCheckIn ? moment(response.BookingDetails.HotelCheckIn).format("DD MMM YYYY"): 'N/A',
                "Check-out Date": response.BookingDetails.HotelCheckOut? moment(response.BookingDetails.HotelCheckOut).format("DD MMM YYYY"): 'N/A',
                "Total Fare": response.BookingDetails.TotalFair,
                "Lead Passenger Name":name,
                "Lead Passenger Phone No": response.BookingDetails.PhoneNumber,
                "Lead Passenger Email": response.BookingDetails.Email,
                "Booked By": response.BookingDetails.booked_by,
                "Request Created Date": response.BookingDetails.request_created_date ? moment(response.BookingDetails.request_created_date).format("DD MMM YYYY") : 'N/A',
                "Booking Confirmation Date": response.BookingDetails.booking_confirmation_date ? moment(response.BookingDetails.booking_confirmation_date).format("DD MMM YYYY") : 'N/A',
                //"Payment Mode": response.BookingDetails.PaymentMode ? response.BookingDetails.PaymentMode : 'N/A',
                // "Admin Cancellation Date":response.BookingDetails.admin_cancellation_ts ? moment(response.BookingDetails.admin_cancellation_ts).format("DD MMM YYYY"): 'N/A',
                // "Cancellation Charge":response.BookingDetails.cancellation_charge || 'N/A',
                // "Cancelled By":response.BookingDetails.cancelled_by_name || 'N/A',
                // "Invoice No":response.BookingDetails.DomainOrigin || 'N/A'
            }
        });
        const columnWidths = [
            { wch: 5 }
        ];
        const fieldsLength = this.respData.length;
        for (let i = 0; i < fieldsLength; i++) {
            columnWidths.push({ wch: 30 })
        }
            this.loggedInUser = JSON.parse(localStorage.getItem('currentSupervisionUser'));
            let value = this.loggedInUser.auth_role_id == 1 ? "Admin" : 'Staff'
            this.utility.exportToExcel(
                fileToExport,
                value + '-Hotel Report',
                columnWidths
            );
    }
    }

    getTotalAmount(bookingItineraryDetails) {
        let totalAmnt: number = 0;
        bookingItineraryDetails.forEach(o => {
            totalAmnt += o.RoomPrice;
        });
        return totalAmnt;
    }

    getTotalTax(bookingItineraryDetails) {
        let totalTax: number = 0;
        bookingItineraryDetails.forEach(o => {
            totalTax += (+(o.Tax));
        });
        return totalTax;
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

    confirmDelete(data, status) {
        this.deleteData = data;
        this.showConfirm = true;
        this.status = status;
    }

    cancelRequest() {
        this.showConfirm = false;
    }

}
