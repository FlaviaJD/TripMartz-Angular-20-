import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import * as moment from 'moment';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { CorporateCodeService } from '../corporate-code.service';
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-corporate-code-list',
  templateUrl: './corporate-code-list.component.html',
  styleUrls: ['./corporate-code-list.component.scss']
})
export class CorporateCodeListComponent implements OnInit {
    @Output() corporateCodeUpdate = new EventEmitter<any>();
    searchText: string = "";
    pageSize = 50;
    page = 1;
    collectionSize: number = 40;
    private subSunk = new SubSink();
    codeList:any=[];
    noData: boolean = true;
    userTitleList:Array<any>=[];
    regConfig: FormGroup;
    loading: boolean = false;
    primaryColour: any;
    secondaryColour: any;
    loadingTemplate: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'corporateName', value: 'Corporate Name' },
        { key: 'airline', value: 'Airline Name (Airline Code)' },
        { key: 'domCode', value: 'Domestic Code' },
        { key: 'intCode', value: 'International Code' },
        { key: 'createdAt', value: 'CreatedAt' }
    ];

    constructor(
        private utility: UtilityService,
        private fb: FormBuilder,
        private apiHandlerService:ApiHandlerService,
        private swalService:SwalService,
        private corporateCodeService:CorporateCodeService
    ) { }

    ngOnInit() {
        this.getCorporateCodeList();
    }

    getCorporateCodeList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('corporateFareCodeFindAll', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.codeList=res.data;
                respDataCopy = [...this.codeList];
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.noData=false;
         });
    }

    delete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.loading=true;
                this.subSunk.sink = this.apiHandlerService.apiHandler('corporateFareCodeDelete', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.loading=false;
                            this.swalService.alert.success(`Deleted successfully`);
                            this.getCorporateCodeList();
                            }
                            else{
                                this.loading=false;
                                this.swalService.alert.opps('Unable to delete')
                            }
                        },(err: HttpErrorResponse) => {
                            this.loading=false;
                            this.swalService.alert.error(err['error']['Message']);
                        }
                    );
            }
        })
    }

    pdfCallbackFn(pdf: any) {
        this.utility.pdfCallbackFn(pdf);
    }

    updateUser(data){
        this.corporateCodeService.updateData.next(data);
        this.corporateCodeUpdate.emit({ tabId: 'add_update_corporate_code', data });
    }


    exportExcel(): void {
        const fileToExport = this.codeList.map((response: any, index: number) => {
            let status=response.status==1?'Active':'In-Active'
            return {
                "Sl No.": index + 1,  
                "Corporate Name": response.CorporateName ||'N/A',
                "Airline Name (Airline Code)": response.AirlineName,
                "DomCode": response.DomCode,
                "IntCode": response.IntCode,
                "CreatedAt": moment(response.CreatedAt).format("MMM DD, YYYY"),
            }
        });

        const columnWidths = [
            { wch: 5 }
        ];
        const fieldsLength = this.codeList.length;
        for (let i = 0; i < fieldsLength; i++) {
            columnWidths.push({ wch: 30 })
        }
        this.utility.exportToExcel(
            fileToExport,
            'Corporate Code List',
            columnWidths
        );
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.codeList = data;
            return;
        }
        this.codeList = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'corporateName': return this.utility.compare('' + a.CorporateName, '' + b.CorporateName, isAsc);
                case 'airline': return this.utility.compare('' + a.AirlineName, '' + b.AirlineName, isAsc);
                case 'domCode': return this.utility.compare('' + a.DomCode, '' + b.DomCode, isAsc);
                case 'intCode': return this.utility.compare('' + a.IntCode, '' + b.IntCode, isAsc);
                case 'createdAt': return this.utility.compare('' + a.CreatedAt, '' + b.CreatedAt, isAsc);
                default: return 0;
            }
        });
    }


    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                corporateName: status,
                airline: status,
                domCode: objData.booking_from,
                intCode: objData.employee_name,
                createdAt: objData.hotel_name,
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.codeList = filterArray;
        else
            this.codeList = !filterArray.length && text.length ? filterArray : [...respDataCopy];
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }


}

