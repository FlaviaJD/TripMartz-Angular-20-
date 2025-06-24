import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { SettingService } from '../../../../settings/setting.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { Sort } from '@angular/material';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cost-center-list',
  templateUrl: './cost-center-list.component.html',
  styleUrls: ['./cost-center-list.component.scss']
})
export class CostCenterListComponent implements OnInit {

    @Output() costCenterUpdate = new EventEmitter<any>();
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "cost_center_id", value: 'Cost Center ID' },
        { key: "cost_center_name", value: 'Name' },
        
    ];

    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';
    private subSunk = new SubSink();

    constructor(
        private settingService: SettingService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private masterService:MasterService
    ) { }

    ngOnInit() {
        this.getCostCenterList();
    }

    getCostCenterList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getCostCenter', 'post', {}, {},{
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

    onCostCenterUpdate(data): void {
        this.masterService.costCenterUpdateData.next(data);
        this.costCenterUpdate.emit({ tabId: 'create/update_cost', data });
    }

    onCostCenterDelete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                //api call to delete the record 
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteCostCenter', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`Cost Center ${data.cost_center_name} has been deleted successfully`);
                            this.getCostCenterList();
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
                "Cost Center ID": response.cost_center_id,
                "Name": response.cost_center_name  
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 20 },
            { wch: 30 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Cost Center Report',
            columnWidths
        );
    }

}
