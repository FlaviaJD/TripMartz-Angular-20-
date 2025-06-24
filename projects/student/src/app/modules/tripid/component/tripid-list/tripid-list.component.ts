import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import { Router } from '@angular/router';
import { ExportAsService } from 'ngx-export-as';
import { ApiHandlerService } from 'projects/student/src/app/core/api-handlers';
import { SwalService } from 'projects/student/src/app/core/services/swal.service';
import { UtilityService } from 'projects/student/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { TripIdService } from '../../services/trip-id.service';
let filterArray: Array<any> = [];
@Component({
    selector: 'app-tripid-list',
    templateUrl: './tripid-list.component.html',
    styleUrls: ['./tripid-list.component.scss']
})
export class TripidListComponent implements OnInit {
    regConfig: FormGroup;
    isOpen = false as boolean;
    loadingTemplate: any;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'DD-MM-YYYY',
        rangeInputFormat: 'DD-MM-YYYY',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate = new Date();
    noData: boolean = true;
    respData: Array<any> = [];
    pageSize = 10;
    page = 1;
    collectionSize: number;
    protected subs = new SubSink();
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'tripId', value: 'Trip ID' },
        { key: 'tripName', value: 'Trip Name' },
        { key: 'fromDate', value: 'From Date' },
        { key: 'toDate', value: 'To Date' },
        // { key: 'serviceList', value: 'Service List' },
        { key: 'createdAt', value: 'Created At' },

    ];
    deleteData: any;
    showConfirm: boolean;
    loading: boolean;

    constructor(
        private swalService: SwalService,
        private tripService: TripIdService,
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private fb: FormBuilder,
        private exportAsService: ExportAsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getTripIdList();
    }

    getTripIdList() {
        this.noData = true;
        this.respData = [];
        this.subs.sink = this.apiHandlerService.apiHandler('getTripIdList', 'POST', {}, {}).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length > 0) {
                this.noData = false;
                this.respData = res.data;
                this.collectionSize = this.respData.length;
            } else {
                this.respData = [];
                this.noData = false;
                this.collectionSize = this.respData.length;
            }
        }, (err: HttpErrorResponse) => {
            this.respData = [];
            this.noData = false;
            this.collectionSize = this.respData.length;
        }
        );
    }

    onValueChange(event) {

    }

    timelineFilter(value) {

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
                case 'tripId': return this.utility.compare('' + a.TripID, '' + b.TripID, isAsc);
                case 'tripName': return this.utility.compare('' + a.TripName, '' + b.TripName, isAsc);
                case 'fromDate': return this.utility.compare('' + a.FromDate, '' + b.FromDate, isAsc);
                case 'toDate': return this.utility.compare('' + a.ToDate, '' + b.ToDate, isAsc);
                case 'serviceList': return this.utility.compare('' + a.ServiceList, '' + b.ServiceList, isAsc);
                case 'createdAt': return this.utility.compare('' + a.CreatedAt, '' + b.CreatedAt, isAsc);
                default: return 0;
            }
        });
    }

    update(data) {
        this.router.navigate(['/tripid', 'create-tripid']);
        this.tripService.tripData.next(data);
    }


    delete(data) {
        this.deleteData = data;
        this.showConfirm = true;
    }

    deleteRequest() {
        this.showConfirm=false;
        this.loading = true;
        this.respData = [];
        this.subs.sink = this.apiHandlerService.apiHandler('deleteTripId', 'POST', {},{},{id:this.deleteData.id}).subscribe(res => {
            if ((res.statusCode == 200 || res.statusCode == 201) && res.data && res.data.length > 0) {
                this.loading = false;
                this.swalService.alert.success("Deleted successfully.");
                this.getTripIdList();
            } else {
                this.loading = false;
                this.swalService.alert.oops("Unable to delete.");
            }
        }, (err: HttpErrorResponse) => {
            this.loading = false;
            this.swalService.alert.oops("Unable to delete.");
        }
        );
    }

    hide() {
        this.showConfirm = false
    }

}
