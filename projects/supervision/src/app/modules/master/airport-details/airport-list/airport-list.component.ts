import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';


@Component({
  selector: 'app-airport-list',
  templateUrl: './airport-list.component.html',
  styleUrls: ['./airport-list.component.scss']
})
export class AirportListComponent implements OnInit {

    @Output() airportUpdate = new EventEmitter<any>();
    searchText: string = "";
    pageSize = 50;
    page = 1;
    collectionSize: number = 40;
    private subSunk = new SubSink();
    airportList:any=[];
    noData: boolean = true;
    regConfig: FormGroup;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'name', value: 'Airport Name' },
        { key: 'country', value: 'Airport Country' },
        { key: 'city', value: 'Airport City' },
        { key: 'code', value: 'Airport Code' },
        { key: 'status', value: 'Status' },
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private masterService:MasterService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.masterService.airportUpdateData.next('');
        this.setSearchForm();
        this.getAirportList();
    }

    setSearchForm(){
        this.regConfig = this.fb.group({
            name: new FormControl(''),
            country: new FormControl(''),
            city: new FormControl(''),
            code: new FormControl(''),
            status: new FormControl('')
        });
    }

    getAirportList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getAirport', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.airportList=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    onSearchSubmit(): void {
        const data=this.regConfig.value;
        this.subSunk.sink = this.apiHandlerService.apiHandler('getFilterAirport', 'post', {}, {},{
            ...data
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.airportList=res.data;
                this.noData=false;
                this.collectionSize = res.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    updateUser(data){
        this.masterService.airportUpdateData.next(data);
    	this.airportUpdate.emit({ tabId: 'add_update_airport', data });
    }

    exportExcel(): void {
        const fileToExport = this.airportList.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "Airport Name": response.name,
                "Airport Country": response.country,
                "Airport City": response.city,
                "Airport Code": response.code,
                "Status": response.status     
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 30 },
            { wch: 30 },
            { wch: 20 },
            { wch: 20 },
            { wch: 10 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Airport Master Report',
            columnWidths
        );
    }

    download(type: SupportedExtensions, orientation?: string) {
       
    }

    sortData(sort: Sort) {
    }

    onReset(){
        
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
