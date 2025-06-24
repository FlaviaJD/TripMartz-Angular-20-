import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import { SupportedExtensions } from 'ngx-export-as';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { MasterService } from '../../master.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

@Component({
  selector: 'app-airline-list',
  templateUrl: './airline-list.component.html',
  styleUrls: ['./airline-list.component.scss']
})
export class AirlineListComponent implements OnInit {

    @Output() airlineUpdate = new EventEmitter<any>();
    searchText: string = "";
    pageSize = 50;
    page = 1;
    collectionSize: number = 40;
    private subSunk = new SubSink();
    airlineList:any=[];
    noData: boolean = true;

    regConfig: FormGroup;

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'name', value: 'Airline Name' },
        { key: 'code', value: 'Airline Code' },
        // { key: 'airline_image', value: 'Airline Image' },
        { key: 'status', value: 'Airline Status' },
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private masterService:MasterService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.masterService.airlineUpdateData.next('');
        this.setSearchForm();
        this.getAirlineList();
    }

    setSearchForm(){
        this.regConfig = this.fb.group({
            name: new FormControl(''),
            code: new FormControl(''),
            status: new FormControl('')
        });
    }

    getAirlineList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getAirline', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.airlineList=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    updateUser(data){
        this.masterService.airlineUpdateData.next(data);
    	this.airlineUpdate.emit({ tabId: 'add_update_airline', data });
    }

    exportExcel(): void {
        const fileToExport = this.airlineList.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "Airline Name": response.name,
                "Airline Code": response.code,
                "Status": response.status     
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Airline Master Report',
            columnWidths
        );
    }

    download(type: SupportedExtensions, orientation?: string) {
       
    }

    sortData(sort: Sort) {
    }
    
    onSearchSubmit(){

    }

    onReset(){
        
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
