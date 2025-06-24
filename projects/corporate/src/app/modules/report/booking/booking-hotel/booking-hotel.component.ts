import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatOptionModule, Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Logger } from 'projects/corporate/src/app/core/logger/logger.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { formatDate } from 'ngx-bootstrap/chronos';
import * as moment from 'moment';
const log = new Logger('report/B2cHotelComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
    selector: 'app-booking-hotel',
    templateUrl: './booking-hotel.component.html',
    styleUrls: ['./booking-hotel.component.scss']
})
export class BookingHotelComponent implements OnInit {
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

    pageSize = 100;
    page = 1;
    collectionSize: number;
    respDataCopy: any;
    displayColumn: { key: string, value: string }[] = [
    ];
    noData: boolean = true;
    respData: Array<any> = [];
    showModal : boolean;
    showCancelModal : boolean;
    currentRecord : any = [];
    paxDetails : any = {
        "Title" : "",
        "FirstName" : "",
        "LastName" : "",
    };
    searchText:string="";
    maxDate=new Date();
    currentUser: any;
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService
    ) {
            this.currentUser = JSON.parse(localStorage.getItem('currentCorpUser')) || {};

if (this.currentUser.auth_role_id == 10) {
            const columnsToAdd: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'status', value: 'Status' },
        { key: 'corporateName', value: 'Finance Name' },
        { key: 'HotelName', value: 'Hotel Name' },
        { key: 'check_inDate', value: 'Checkin Date' },
        { key: 'Check_outDate', value: 'Checkout Date' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'leadPassengerName', value: 'Lead Passenger Name' },
        { key: 'phoneNumber', value: 'Lead Passenger Phone' },
        { key: 'Email', value: 'Lead Passenger Email' },
        { key: 'payment_mode', value: 'Board Type' },
        { key: 'cancellation_date', value: 'Cancellation Date' },
        { key: 'booked_By', value: 'Booked By' },
        { key: 'booked_on', value: 'Booked On' }
            ]
         this.displayColumn.push(...columnsToAdd);
        }
        else{
             const columnsToAdd: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'AppReference', value: 'Application Reference' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'status', value: 'Status' },
        { key: 'app_status', value: 'Approvar Status' },
        { key: 'app_name', value: 'Approvar Name' },
        { key: 'corporateName', value: 'Corporate Name' },
        { key: 'HotelName', value: 'Hotel Name' },
        { key: 'check_inDate', value: 'Checkin Date' },
        { key: 'Check_outDate', value: 'Checkout Date' },
        { key: 'total_fare', value: 'Total Fare' },
        { key: 'leadPassengerName', value: 'Lead Passenger Name' },
        { key: 'phoneNumber', value: 'Lead Passenger Phone' },
        { key: 'Email', value: 'Lead Passenger Email' },
        { key: 'payment_mode', value: 'Board Type' },
        { key: 'cancellation_date', value: 'Cancellation Date' },
        { key: 'booked_By', value: 'Booked By' },
        { key: 'booked_on', value: 'Booked On' }
            ]
          this.displayColumn.push(...columnsToAdd);

        }
     }

    ngOnInit() {
     let fromDate= this.utility.setFromDate();
     let tommorow=this.utility.setToDate();
        this.regConfig = this.fb.group({
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            phone_number: new FormControl('', [Validators.maxLength(50)]),
            email: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            status: new FormControl('ALL'),
        });
        this.regConfig.patchValue({
            booked_from_date: fromDate,
            booked_to_date: tommorow
        })
        this.getB2bHotelReport();
    }
    onSearchSubmit() {
        this.getB2bHotelReport();
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
        this.getB2bHotelReport();
    }

    getB2bHotelReport() {
        this.noData = true;
        this.respData = [];
        let reqBody = {};
         let user_type='corporate';
        if(this.currentUser.auth_role_id==10){
        user_type='finance';
        }
        if (!this.utility.isEmpty(this.regConfig.value)) {
            reqBody = {
                "booked_from_date": formatDate(this.regConfig.value.booked_from_date, 'YYYY-MM-DD'), 
                "booked_to_date":formatDate( this.regConfig.value.booked_to_date,'YYYY-MM-DD'), 
                'phone':this.regConfig.value.phone_number,
                "status": this.regConfig.value.status || "ALL",
                "app_reference": this.regConfig.value.app_reference || "",
                "pnr": this.regConfig.value.pnr || "",
                "email": this.regConfig.value.email || "",
                "user_type":user_type
            }
        } else {
            reqBody = {}
        } this.subSunk.sink = this.apiHandlerService.apiHandler('b2bHotelReport', 'post', {}, {}, reqBody).subscribe(resp => {
            if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                this.noData = false;
                this.respData = resp.data || [];
                this.respDataCopy = resp.data;
                this.collectionSize = this.respDataCopy.length;
            }
            else {
                this.noData=false;
                this.respData=[];
            }
        }, (err) => {
            this.noData=false;
            this.respData=[];
        });
    }
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }
    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            let name='';
            const pax = response.BookingPaxDetails.length > 0 ? response.BookingPaxDetails[0] : null;
            if (pax && pax.FirstName && pax.LastName) {
                name = pax.FirstName + ' ' + pax.LastName;
            } 
             if(this.currentUser.auth_role_id==10){
            return {
                "Sl No.": index + 1,
                "Application Reference": response.BookingDetails.AppReference,
                "Status": this.getFormtedStatus(response.BookingDetails.Status),
                "Corporate Name":'N/A',
                "Hotel Name": response.BookingDetails.HotelName,
                "Check-in Date": moment(response.BookingDetails.HotelCheckIn).format("DD MMM YYYY"),
                "Check-out Date": moment(response.BookingDetails.HotelCheckOut).format("DD MMM YYYY"),
                "Total Fare": response.BookingDetails.TotalFair,
                "Lead Passenger Name":name,
                "Lead Passenger Phone Number": response.BookingDetails.PhoneNumber,
                "Lead Passenger Email": response.BookingDetails.Email,
                "Board Type": response.BookingDetails.PaymentMode ? response.BookingDetails.PaymentMode : 'N/A',
                // "Admin Cancellation Remark":response.BookingDetails.admin_cancellation_remark || 'N/A',
                "Cancellation Date":response.BookingDetails.admin_cancellation_ts ? moment(response.BookingDetails.admin_cancellation_ts).format("DD MMM YYYY"): 'N/A',
                "Booked By":response.BookingDetails.booked_by,
                "Booked On": moment(response.BookingDetails.BookedOn).format("MMM DD, YYYY")
            }
        }
            else{
                return {
                "Sl No.": index + 1,
                "Application Reference": response.BookingDetails.AppReference,
                "Trip Id":response.BookingDetails.trip_id,
                "Trip Name":response.BookingDetails.trip_name,
                "Status": this.getFormtedStatus(response.BookingDetails.Status),
                "Approvar Status":response.BookingDetails.ApprovalStatus || "PENDING",
                "Corporate Name":'N/A',
                "Hotel Name": response.BookingDetails.HotelName,
                "Check-in Date": moment(response.BookingDetails.HotelCheckIn).format("DD MMM YYYY"),
                "Check-out Date": moment(response.BookingDetails.HotelCheckOut).format("DD MMM YYYY"),
                "Total Fare": response.BookingDetails.TotalFair,
                "Lead Passenger Name":name,
                "Lead Passenger Phone Number": response.BookingDetails.PhoneNumber,
                "Lead Passenger Email": response.BookingDetails.Email,
                "Board Type": response.BookingDetails.PaymentMode ? response.BookingDetails.PaymentMode : 'N/A',
                // "Admin Cancellation Remark":response.BookingDetails.admin_cancellation_remark || 'N/A',
                "Cancellation Date":response.BookingDetails.admin_cancellation_ts ? moment(response.BookingDetails.admin_cancellation_ts).format("DD MMM YYYY"): 'N/A',
                "Booked By":response.BookingDetails.booked_by,
                "Booked On": moment(response.BookingDetails.BookedOn).format("MMM DD, YYYY")
            }

        }
        });

        const columnWidths = [
            { wch: 5 },
            { wch: 15 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 30 },
            { wch: 25 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Corporate-Hotel Report',
            columnWidths
        );
    }
    noOfNights(i, o) {
        return this.utility.calculateDiff(i, o);
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = this.respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                type: objData.BookingDetails.Type,
                appReference: objData.BookingDetails.AppReference,
                status: objData.BookingDetails.Status,
                HotelName: objData.BookingDetails.HotelName,
                check_inDate: objData.BookingDetails.HotelCheckIn,
                Check_outDate: objData.BookingDetails.HotelCheckOut,
                phoneNumber: objData.BookingDetails.PhoneNumber,
                approvar_stage_two:objData.BookingDetails.approvar_stage_two,
                Email: objData.BookingDetails.Email,
                total_fare: objData.BookingDetails.TotalFair,
                leadPassengerName:objData['BookingPaxDetails'][0]['FirstName'],
                payment_mode: objData.BookingDetails.PaymentMode,
                admin_cancellation_ts:objData.BookingDetails.admin_cancellation_ts,
                cancellation_charge:objData.BookingDetails.cancellation_charge,
                cancelled_by_id:objData.BookingDetails.cancelled_by_name,
                invoice_no:objData.BookingDetails.DomainOrigin,
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
      const data = filterArray.length ? filterArray : [...this.respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc'
            switch (sort.active) {
                case 'type': return this.utility.compare('' + a.BookingDetails.Type, '' + b.BookingDetails.Type, isAsc);
                case 'appReference': return this.utility.compare('' + a.BookingDetails.AppReference, '' + b.BookingDetails.AppReference, isAsc);
                case 'status': return this.utility.compare('' + a.BookingDetails.Status.toLocaleLowerCase(), '' + b.BookingDetails.Status.toLocaleLowerCase(), isAsc);
                case 'approvar_stage_two': return this.utility.compare(+ a.BookingDetails.approvar_stage_two, + b.BookingDetails.approvar_stage_two, isAsc);
                case 'HotelName': return this.utility.compare(+ a.BookingDetails.HotelName, + b.BookingDetails.HotelName, isAsc);
                case 'check_inDate': return this.utility.compare(+ a.BookingDetails.HotelCheckIn, + b.BookingDetails.HotelCheckIn, isAsc);
                case 'Check_outDate': return this.utility.compare(+ a.BookingDetails.HotelCheckOut, + b.BookingDetails.HotelCheckOut, isAsc);
                case 'total_fare': return this.utility.compare(+ a.BookingDetails.TotalFair, + b.BookingDetails.TotalFair, isAsc);
                case 'leadPassengerName': return this.utility.compare(+ a['BookingPaxDetails'][0]['FirstName'], + b['BookingPaxDetails'][0]['LastName'], isAsc);
                case 'phoneNumber': return this.utility.compare(+ a.BookingDetails.PhoneNumber, + b.BookingDetails.PhoneNumber, isAsc);
                case 'Email': return this.utility.compare(+ a.BookingDetails.Email, + b.BookingDetails.Email, isAsc);
                case 'payment_mode': return this.utility.compare(+ a.BookingDetails.PaymentMode, + b.BookingDetails.PaymentMode, isAsc);
                case 'admin_cancellation_ts': return this.utility.compare(+ a.BookingDetails.admin_cancellation_ts, + b.BookingDetails.admin_cancellation_ts, isAsc);
                case 'cancellation_charge': return this.utility.compare(+ a.BookingDetails.cancellation_charge, + b.BookingDetails.cancellation_charge, isAsc);
                case 'cancelled_by_id': return this.utility.compare(+ a.BookingDetails.cancelled_by_name, + b.BookingDetails.cancelled_by_name, isAsc);
                case 'invoice_no': return this.utility.compare(+ a.BookingDetails.DomainOrigin, + b.BookingDetails.DomainOrigin, isAsc);
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
            this.getB2bHotelReport();
        }
    }

    showPaymentInfo(data) {
        
    }

    showPaxProfile(data){
        this.showModal = true;
        this.currentRecord = data;
        this.paxDetails = data.BookingPaxDetails.filter(x => {
            return x.LeadPax == true
        });
        this.paxDetails = this.paxDetails[0];
    }

    hide()
    {
      this.showModal = false;
      this.showCancelModal = false;
    }

    numberOnly(event): boolean {
        return this.utility.numberOnly(event);
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
