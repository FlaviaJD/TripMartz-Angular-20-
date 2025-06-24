import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];
@Component({
  selector: 'app-cancellation-hotel-queues',
  templateUrl: './cancellation-hotel-queues.component.html',
  styleUrls: ['./cancellation-hotel-queues.component.scss']
})
export class CancellationHotelQueuesComponent implements OnInit {

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
        pageSize = 10;
        page = 1;
        collectionSize: number;
        noData: boolean = true;
        subjectName:string;
        filteredCorp: Observable<string[]>;
        corporateList: string[] = ['TripMartz'];
    
        displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appreference', value: 'Application Reference' },
        { key: 'trip_id', value: 'Trip Id' },
        { key: 'trip_name', value: 'Trip Name' },
        { key: 'booking_status', value: 'Booking Status' },
        { key: 'requested_Date', value: 'Cancellation Requested Date' },
        // { key: 'amount_Refund', value: 'Amount Refunded' },
        // { key: 'cancellation_Charge', value: 'Cancellation Charge' },
        { key: 'employee_reason', value: 'Employee Reason' },
        { key: 'hotel_name', value: 'Hotel Name' },
        { key: 'confirmation_ref', value: 'Confirmation Number' },
        { key: 'booked_from', value: 'Booked On' },
        { key: "employee_name", value: 'Employee Name' },
        { key: 'city', value: 'City' },
        { key: 'paymentMode', value: 'Payment Mode' },
        { key: 'purpose', value: 'Purpose' }
    ];

    constructor(
            private fb: FormBuilder,
            private utility:UtilityService,
            private apiHandlerService:ApiHandlerService
        ) { }
    
        ngOnInit() {
            this.regConfig = this.fb.group({
                app_reference: new FormControl('', [Validators.maxLength(120)]),
                status: new FormControl('CANCELLATION_PENDING', [Validators.maxLength(120)]),
                booked_from_date: new FormControl('', [Validators.maxLength(120)]),
                booked_to_date: new FormControl('', [Validators.maxLength(120)]),
                purpose: new FormControl(''),
                corporate: new FormControl('', [Validators.maxLength(120)]),
            });
            this.setCorporate();
            this.getHotelQueue();
        }
    
    
        setCorporate() {
            this.filteredCorp = this.regConfig.controls.corporate.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
        }
    
        _filter(value: string): string[] {
            const filterValue = value.toLowerCase();
            return this.corporateList.filter(corporate => corporate.toLowerCase().includes(filterValue));
        }
       
    
        onSearchSubmit(){
            this.getHotelQueue();
        }
       
        onReset(){
        }
    
        onSelectionChanged(event) {
        }
        
        updateHotelQueue(data:any){
            this.hotelQueueUpdate.emit({ tabId: 'add_update_cancellation_hotel_queue', data });
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
                const filterOnFields = {
                    booking_status:status,
                    trip_id:objData.trip_id,
                    trip_name:objData.trip_name,
                    booked_from:objData.created_at,
                    employee_name:objData.employee_name,
                    hotel_name:objData.hotel_name,
                    requested_Date:objData.cancellation_ts,
                    employee_reason:objData.employee_cancellation_remark,
                    city:objData.City,
                    appreference: objData.request_id,
                    confirmation_ref:objData.confirmation_reference,
                    paymentMode:objData.payment_mode,
                    purpose:objData.Purpose
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
                    case 'booked_from': return this.utility.compare('' + a.created_at, '' + b.created_at, isAsc);
                    case 'employee_name': return this.utility.compare('' + a.employee_name, '' + b.employee_name, isAsc);
                    case 'hotel_name': return this.utility.compare('' + a.hotel_name, '' + b.hotel_name, isAsc);
                    case 'requested_Date': return this.utility.compare('' + a.cancellation_ts, '' + b.cancellation_ts, isAsc);
                    case 'employee_reason': return this.utility.compare('' + a.employee_cancellation_remark, '' + b.employee_cancellation_remark, isAsc);
                    case 'city': return this.utility.compare('' + a.City, '' + b.City, isAsc);
                    case 'appreference': return this.utility.compare('' + a.request_id, '' + b.request_id, isAsc);
                    case 'confirmation_ref': return this.utility.compare('' + a.confirmation_reference, '' + b.confirmation_reference, isAsc);
                    case 'paymentMode': return this.utility.compare('' + a.payment_mode, '' + a.payment_mode, isAsc);
                    case 'purpose': return this.utility.compare(+ a.Purpose, + b.Purpose, isAsc);
                    default: return 0;
                }
            });
        }
    
        exportExcel(): void {
            const fileToExport = this.respData.map((response: any, index: number) => {
                let created_at = response.created_at !== 'undefined' ? moment(response.created_at).format("DD MMM YYYY") : 'N/A';
                return {
                    "Sl No.": index + 1,
                    "Application Reference": response.trip_id,
                    "Trip Id": response.request.trip_name,
                    "Booking Status": this.getFormtedStatus(response.status),
                    "Cancellation Requested Date": response.cancellation_ts? moment(response.cancellation_ts).format("DD MMM YYYY"):'N/A',
                    "Employee Reason": response.employee_cancellation_remark? response.employee_cancellation_remark:'N/A',
                    "Hotel Name": response.hotel_name || 'N/A',
                    "Confirmation Number": response.confirmation_reference? response.confirmation_reference:'N/A',
                    "Booked On": created_at,
                    "Employee Name": response.employee_name,
                    "City": response.City || 'N/A',
                    "Payment Mode": response.payment_mode?response.payment_mode:"N/A",
                    "Purpose": response.Purpose? response.Purpose:"N/A"
                }
            });
    
            const columnWidths = [
                { wch: 5 },
                { wch: 15 },
                { wch: 50 },
                { wch: 15 },
                { wch: 30 },
                { wch: 50 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 30 },
                { wch: 25 }
            ];
    
            this.utility.exportToExcel(
                fileToExport,
                'Hotel Cancellation Queues',
                columnWidths
            );
        }
    
        getFormtedStatus(status: string) {
            let tmpStatus = status.split('_');
            return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
        }
    }
    