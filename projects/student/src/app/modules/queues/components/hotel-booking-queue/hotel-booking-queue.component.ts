import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-hotel-booking-queue',
    templateUrl: './hotel-booking-queue.component.html',
    styleUrls: ['./hotel-booking-queue.component.scss']
})
export class HotelBookingQueueComponent implements OnInit {

    @Output() trainQueueUpdate = new EventEmitter<any>();
    private subSunk = new SubSink();
    searchText: string;
    regConfig: FormGroup;
    respData: Array<any> = [];
    respDataCopy: any;
    showConfirm: boolean = false;
    isOpen = false as boolean;
    pageSize = 100;
    page = 1;
    collectionSize: number;
    noData: boolean = true;
    subjectName: string;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    loading: boolean = false;
    deleteData: any = [];
    setMinDate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'appreference', value: 'Application Reference' },
        { key: 'hotel_name', value: 'Hotel Name' },
        { key: 'booking_status', value: 'Booking Status' },
        { key: 'approvar_status', value: 'Approvar Status' },
        { key: 'confirmation_ref', value: 'Confirmation Number' },
        { key: 'booked_from', value: 'Booked From' },
        { key: "employee_name", value: 'Employee Name' },
        { key: 'city', value: 'City' },
        { key: 'fare', value: 'Fare' },
        { key: 'markup', value: 'Markup' },
        { key: 'discount', value: 'Discount' },
        { key: 'totalFare', value: 'Total Fare' },
        { key: 'paymentMode', value: 'Payment Mode' },
        { key: 'bookedOn', value: 'Created On' },
        { key: 'purpose', value: 'Purpose' }
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private cdr: ChangeDetectorRef,
        private utility: UtilityService,
        private swalService: SwalService
    ) { }

    ngOnInit() {
        this.regConfig = this.fb.group({
            app_reference: new FormControl('', [Validators.maxLength(120)]),
            status: new FormControl('BOOKING_HOLD', [Validators.maxLength(120)]),
            booked_from_date: new FormControl('', [Validators.maxLength(120)]),
            booked_to_date: new FormControl('', [Validators.maxLength(120)]),
            purpose: new FormControl(''),
        });
        this.getHotelQueue();
    }

    getHotelQueue() {
        this.noData = true;
        this.respData = [];
        let reqBody = {
            "status": "BOOKING_HOLD"
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
                approvar_status:status,
                booked_from:objData.booking_from,
                employee_name:objData.employee_name,
                hotel_name:objData.hotel_name || 'N/A',
                city:objData.city,
                appreference: objData.app_reference,
                confirmation_ref:objData.confirmation_reference,
                fare:objData.total_fare,
                markup: objData.Markup,
                discount:objData.discount,
                totalFare:objData.total_fare,
                paymentMode:objData.payment_mode,
                bookedOn:objData.created_datetime,
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

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            let booking_from = response.booking_from !== 'undefined' ? response.booking_from : 'N/A';
            return {
                "Sl No.": index + 1,
                "Application Reference": response.app_reference,
                "Hotel Name": response.hotel_name||'N/A',
                "Booking Status": this.getFormtedStatus(response.status),
                "Approvar Status": this.getFormtedStatus(response.status),
                "Confirmation Number": response.confirmation_reference? response.confirmation_reference:'N/A',
                "Booked From": booking_from,
                "Employee Name": response.employee_name,
                "City": response.city,
                "Fare": response.total_fare,
                "Markup": response.Markup,
                "Discount": response.convinence_amount,
                "Total Fare": response.total_fare,
                "Payment Mode": response.payment_mode?response.payment_mode:"N/A",
                "Created On": moment(response.created_datetime).format("MMM DD, YYYY"),
                "Purpose": response.Purpose? response.Purpose:"N/A"

            }
        });

        const columnWidths = [
            { wch: 5 },
            { wch: 15 },
            { wch: 30 },
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
            'Hotel Queues',
            columnWidths
        );
    }

    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

    onSearchSubmit() {
        this.getHotelQueue();
    }

    hide() {
        this.showConfirm = false;
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
                case 'booking_status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'approvar_status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                case 'booked_from': return this.utility.compare('' + a.booking_from, '' + b.booking_from, isAsc);
                case 'employee_name': return this.utility.compare('' + a.employee_name, '' + b.employee_name, isAsc);
                case 'hotel_name': return this.utility.compare('' + a.hotel_name, '' + b.hotel_name, isAsc);
                case 'city': return this.utility.compare('' + a.city, '' + b.city, isAsc);
                case 'appreference': return this.utility.compare('' + a.app_reference, '' + b.app_reference, isAsc);
                case 'confirmation_ref': return this.utility.compare('' + a.confirmation_reference, '' + b.confirmation_reference, isAsc);
                case 'fare': return this.utility.compare('' + a.total_fare, '' + b.total_fare, isAsc);
                case 'markup': return this.utility.compare('' + a.Markup, '' + b.Markup, isAsc);
                case 'convenienceFee': return this.utility.compare('' + a.convinence_amount, '' + b.convinence_amount, isAsc);
                case 'discount': return this.utility.compare('' + a.discount, '' + b.discount, isAsc);
                case 'totalFare': return this.utility.compare(+ a.total_fare, + b.total_fare, isAsc);
                case 'paymentMode': return this.utility.compare('' + a.payment_mode, '' + a.payment_mode, isAsc);
                case 'bookedOn': return this.utility.compare('' + a.created_datetime, '' + b.created_datetime, isAsc);
                case 'purpose': return this.utility.compare(+ a.Purpose, + b.Purpose, isAsc);
                default: return 0;
            }
        });
    }

    onReset() {
    }

    onSelectionChanged(event) {
    }
}