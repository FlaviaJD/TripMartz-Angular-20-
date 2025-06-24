import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { SettingService } from '../../../../settings/setting.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Sort } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterService } from '../../../master.service';

@Component({
  selector: 'app-purpose-list',
  templateUrl: './purpose-list.component.html',
  styleUrls: ['./purpose-list.component.scss']
})
export class PurposeListComponent implements OnInit {

    @Output() purposeUpdate = new EventEmitter<any>();
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "purpose_name", value: 'Name' },
        
    ];

    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';

    private subSunk = new SubSink();

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private settingService: SettingService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private masterService:MasterService
    ) { }

    ngOnInit() {
        this.getPurposeList();
    }

    getPurposeList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPurpose', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.respData=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
            },(err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
         });
    }

    onPurposeUpdate(data): void {
        this.masterService.purposeUpdateData.next(data);
        this.purposeUpdate.emit({ tabId: 'create/update_purpose', data });
    }

    onPurposeDelete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deletePurpose', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`Purpose ${data.purpose_name} has been deleted successfully`);
                            this.getPurposeList();
                            }
                        },(err: HttpErrorResponse) => {
                            this.swalService.alert.error(err['error']['Message']);
                        }
                    );
            }
        })
    }

    sortData(sort: Sort) {
        
    }

    exportAsExcel(){
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "Name": response.purpose_name  
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
            'Purpose Master Report',
            columnWidths
        );
    }


}
