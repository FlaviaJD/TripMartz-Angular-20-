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
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss']
})
export class PositionListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "position_id", value: 'Position ID' },
        { key: "position_name", value: 'Name' },
        
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
        this.getPositionList();
    }

    getPositionList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getPosition', 'post', {}, {},{
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

    onPositionUpdate(data): void {
        this.masterService.positionUpdateData.next(data);
        this.toUpdate.emit({ tabId: 'create/update_position', data });
    }

    onPositionDelete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deletePosition', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`Position ${data.position_name} has been deleted successfully`);
                            this.getPositionList();
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
                "Position ID": response.position_id,
                "Name": response.position_name    
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 20 },
            { wch: 30 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Position Master Report',
            columnWidths
        );
    }
}
