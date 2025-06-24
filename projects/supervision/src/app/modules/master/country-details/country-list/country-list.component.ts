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
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {

    @Output() countryUpdate = new EventEmitter<any>();
    searchText: string = "";
    pageSize = 50;
    page = 1;
    collectionSize: number = 40;
    private subSunk = new SubSink();
    countryList:any=[];
    noData: boolean = true;
    regConfig: FormGroup;

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'name', value: 'Country Name' },
        { key: 'two_code', value: '2 Digit Country Code' },
        { key: 'code', value: '3 Digit Country Code' },
        { key: 'status', value: 'Status' },
    ];

    constructor(
        private fb: FormBuilder,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private masterService:MasterService,
        private utility: UtilityService
    ) { }

    ngOnInit() {
        this.masterService.countryUpdateData.next('');
        this.setSearchForm();
        this.getCountryList();
    }

    setSearchForm(){
        this.regConfig = this.fb.group({
            name: new FormControl(''),
            two_digit_code: new FormControl(''),
            three_digit_code: new FormControl(''),
            status: new FormControl('')
        });
    }

    getCountryList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCountry', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.countryList=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    updateUser(data){
        this.masterService.countryUpdateData.next(data);
    	this.countryUpdate.emit({ tabId: 'add_update_country', data });
    }

    exportExcel(): void {
        const fileToExport = this.countryList.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "Country Name": response.name,
                "2 Digit Country Code": response.two_code,
                "3 Digit Country Code": response.code,
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
            'Country Master Report',
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
