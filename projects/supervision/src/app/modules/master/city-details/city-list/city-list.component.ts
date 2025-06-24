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
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {

    @Output() cityUpdate = new EventEmitter<any>();
    searchText: string = "";
    pageSize = 50;
    page = 1;
    collectionSize: number = 40;
    private subSunk = new SubSink();
    cityList:any=[];
    noData: boolean = true;
    cityConfig: FormGroup;

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'city_name', value: 'City Name' },
        { key: 'CityCode', value: 'City Code' },
        { key: 'xlpro_city_code', value: 'Xlpro City Code' },
        { key: 'status', value: 'Status' }
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private masterService:MasterService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.masterService.cityUpdateData.next('');
        this.setSearchForm();
        this.getCityList();
    }

    setSearchForm(){
        this.cityConfig = this.fb.group({
            city_name: new FormControl(''),
            city_code: new FormControl(''),
            xlpro_city_code: new FormControl(''),
            status: new FormControl('')
        });
    }

    getCityList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCity', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.cityList=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    updateUser(data){
        this.masterService.cityUpdateData.next(data);
    	this.cityUpdate.emit({ tabId: 'add_update_city', data });
    }

    exportExcel(): void {
        const fileToExport = this.cityList.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "City Name": response.city_name,
                "City Code": response.CityCode,
                "Xlpro City Code": response.xlpro_city_code,
                "Status": response.status     
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 20 },
            { wch: 10 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'City Master Report',
            columnWidths
        );
    }

    download(type: SupportedExtensions, orientation?: string) {
       
    }

    sortData(sort: Sort) {
    }
    
    onCitySearch(){

    }

    onReset(){
        
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }

}
