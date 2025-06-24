import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-hotel-queues',
  templateUrl: './hotel-queues.component.html',
  styleUrls: ['./hotel-queues.component.scss']
})
export class HotelQueuesComponent implements OnInit {
    @Output() hotelQueueUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    showConfirm:boolean=false;
    isOpen = false as boolean;
    maxDate = new Date();
    pageSize = 50;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    subjectName:string;
    filteredCorp: Observable<string[]>;
    corporateList: string[] = ['TripMartz'];

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appreference', value: 'Booking Request Id' },
        { key: 'trip_id', value:'Trip Id'},
        { key: 'trip_name',value:'Trip Name'},
        { key: 'booking_status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: 'approvar_stage_two',value:'Level Two Approval'},
        { key:'corporate_name',value:'Corporate Name'},
        { key: 'booking_type', value: 'Booking Type' },
        { key: "employee_name", value: 'Employee Name' },
        { key: "hotel_name", value: 'Hotel Name' },
        { key: 'city', value: 'City' },
        { key: 'checkInDate', value: 'CheckIn Date' },
        { key: 'checkInTime', value: 'CheckIn Time' },
        { key: 'checkOutDate', value: 'CheckOut Date' },
        { key: 'checkOutTime', value: 'CheckOut Time' },
        { key: 'bookedOn', value: 'Created On' },
    ];
   
    constructor(
        private fb: FormBuilder,
        private utility:UtilityService,
        private apiHandlerService:ApiHandlerService,
        private router: Router
    ) { }

    ngOnInit() {
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig = this.fb.group({
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            status: new FormControl('BOOKING_PENDING', [Validators.maxLength(120)]),
            booked_from_date: new FormControl(fromDate, [Validators.maxLength(120)]),
            booked_to_date: new FormControl(toDate, [Validators.maxLength(120)]),
            purpose: new FormControl(''),
            corporate: new FormControl('', [Validators.maxLength(120)]),
        });
        this.getClientList();
        this.setCorporate();
        this.getHotelQueue();
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
            });
    }

    setCorporate() {
        this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter((option:any )=> (option.business_name+' ('+option.id+')').toLowerCase().includes(filterValue));
    }


    getCompanyName(mailData) {
        if (!mailData) {
            return '';
        }
        try {
            let parsedData = JSON.parse(mailData.replace(/\"/gi, "\""));
            return parsedData.companyName ? parsedData.companyName : '';
        } catch (error) {
            console.error('Error parsing mailData:', error);
            return '';
        }
    }


    onSearchSubmit(){
        this.getHotelQueue();
    }
   
    onSelectionChanged(event) {
    }
    
    updateHotelQueue(data:any){
        this.hotelQueueUpdate.emit({ tabId: 'add_update_hotel_queue', data });
        window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
    }

    getHotelQueue() {
        this.noData = true;
        this.respData = [];
        let reqBody = {
            "status": this.regConfig.get('status').value
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('hotelQueues', 'post', {}, {}, reqBody)
            .subscribe(resp => {
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

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const status=this.getFormtedStatus(objData.status);
            const companyName=this.getCompanyName(objData.mail_data);
            let name= (objData.PaxDetails && objData.PaxDetails.length>0)? (objData.PaxDetails[0].first_name+''+objData.PaxDetails[0].last_name): (objData.employee_name);
            const filterOnFields = {
                booking_status:status,
                approvar_status:status,
                trip_id:objData.trip_id,
                trip_name:objData.trip_name,
                booked_from:objData.booking_from,
                employee_name:name,
                hotel_name:objData.hotel_name,
                city:objData.City,
                companyName:companyName,
                appreference: objData.AppReference,
                confirmation_ref:objData.confirmation_reference,
                paymentMode:objData.payment_mode,
                bookedOn:objData.created_datetime,
                purpose:objData.Purpose,
                approvar_stage_two:objData.BookingDetails.approvar_stage_two,
                corporate_name:objData.BookingDetails.company_name
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
                case 'trip_id': return this.utility.compare('' + a.trip_id, '' + b.trip_id, isAsc);
                case 'trip_name': return this.utility.compare('' + a.trip_name, '' + b.trip_name, isAsc);
                case 'booking_status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'booked_from': return this.utility.compare('' + a.booking_from, '' + b.booking_from, isAsc);
                case 'employee_name': return this.utility.compare('' + a.employee_name, '' + b.employee_name, isAsc);
                case 'company_name': return this.utility.compare('' + this.getCompanyName(a.mail_data), '' + this.getCompanyName(b.mail_data), isAsc);
                case 'hotel_name': return this.utility.compare('' + a.hotel_name, '' + b.hotel_name, isAsc);
                case 'city': return this.utility.compare('' + a.City, '' + b.City, isAsc);
                case 'appreference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'confirmation_ref': return this.utility.compare('' + a.confirmation_reference, '' + b.confirmation_reference, isAsc);
                case 'paymentMode': return this.utility.compare('' + a.payment_mode, '' + a.payment_mode, isAsc);
                case 'bookedOn': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
                case 'purpose': return this.utility.compare(+ a.Purpose, + b.Purpose, isAsc);
                case 'approvar_stage_two': return this.utility.compare(+ a.BookingDetails.approvar_stage_two, + b.BookingDetails.approvar_stage_two, isAsc);
                default: return 0;
            }
        });
    }

    exportExcel(): void {
        if (this.respData && this.respData.length>0) {
        const fileToExport = this.respData.map((response: any, index: number) => {
            let booking_from = response.booking_from !== 'undefined' ? response.booking_from : 'N/A';
            let name= (response.PaxDetails && response.PaxDetails.length>0)? (response.PaxDetails[0].first_name+''+response.PaxDetails[0].last_name): (response.employee_name);
            let approvar_stage_two=response.BookingDetails? response.BookingDetails.approvar_stage_two:'PENDING';
            let companyName=this.getCompanyName(response.mail_data);
            return {
                "Sl No.": index + 1,
                "Booking Request Id": response.app_reference,
                "Trip Id":response.trip_id,
                "Trip Name": response.trip_name,
                "Booking Status": this.getFormtedStatus(response.status),
                "Approvar Status": this.getFormtedStatus(response.status),
                "Level Two Approval": approvar_stage_two,
                "Booking Type":response.BookingType,
                "Company Name":companyName || 'N/A',
                "Employee Name": name,
                "Hotel Name": response.hotel_name || 'N/A',
                "City": response.City,
                "CheckIn Date":response.hotel_check_in,
                "CheckIn Time":response.checkin_time,
                "CheckOut Date":response.hotel_check_out,
                "CheckOut Time":response.checkout_time,
                "Created On": moment(response.created_datetime).format("DD MMM YYYY")
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
            'Hotel Queues',
            columnWidths
        );
        }
    }

    showTemplate(data){
        this.router.navigate(['/dcb-hotel-details'], { state: { data: data } });
    }
    onReset() {
        this.regConfig.reset();
        let fromDate = this.utility.setFromDate();
        let toDate = this.utility.setToDate();
        this.regConfig.patchValue({
            app_reference: '',
            booked_from_date: fromDate,
            booked_to_date: toDate,
            status: 'BOOKING_PENDING',
            purpose:''
        });
        this.getHotelQueue();
    }
  
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }
}
