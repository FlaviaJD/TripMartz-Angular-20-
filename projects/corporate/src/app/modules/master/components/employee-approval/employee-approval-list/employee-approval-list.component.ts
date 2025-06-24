import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers/api-handlers.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { SubSink } from 'subsink/dist/subsink';
import { MasterService } from '../../../master.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Sort } from '@angular/material/sort';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
let filterArray: Array<any> = [];
@Component({
  selector: 'app-employee-approval-list',
  templateUrl: './employee-approval-list.component.html',
  styleUrls: ['./employee-approval-list.component.scss']
})
export class EmployeeApprovalListComponent implements OnInit {
    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "employeeCode", value: 'Employee Code' },
        { key: "approvedRequired", value: 'Approved Required' },
    ];
    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';
    userTitleList: Array<any> = [];
    private subSunk = new SubSink();

    @Output() toUpdate = new EventEmitter<any>();

    constructor(
        private swalService: SwalService,
        private apiHandlerService: ApiHandlerService,
        private masterService:MasterService,
        private utility:UtilityService
    ) { }

    ngOnInit() {
        this.getEmployeeApprovalList();
        this.masterService.approvalUpdateData.next('')
    }

    getEmployeeApprovalList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('approvalList', 'post', {}, {},{
        })
          .subscribe(res => {
              if (res.statusCode == 200 || res.statusCode == 201) {
                this.respData=res.data;
                this.noData=false;
                this.collectionSize = res.data.length;
              }
              else{
                this.noData=false;
                this.respData=[];
              }
            },(err: HttpErrorResponse) => {
                this.noData=false;
                this.respData=[];
         });
    }

    onEmployeeUpdate(data): void {
        this.masterService.approvalUpdateData.next(data);
        this.toUpdate.emit({ tabId: 'create/update_approval', data });
    }

    onEmployeeApprovalDelete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteEmployeeApproval', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`Employee approval has been deleted successfully`);
                            this.getEmployeeApprovalList();
                            }
                        },(err: HttpErrorResponse) => {
                            this.swalService.alert.error(err['error']['Message']);
                        }
                    );
            }
        })
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
                case 'employeeCode': return this.utility.compare('' + a.EmployeeCode, '' + b.EmployeeCode, isAsc);
                case 'approvedRequired': return this.utility.compare('' + a.ApprovedRequired, '' + b.ApprovedRequired, isAsc);
                default: return 0;
            }
        });
    }
    exportAsExcel(){
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,
                "Employee Code": response.EmployeeCode,
                "Approver Required": response.ApprovedRequired,
            }
        });

        const columnWidths = [
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Employee Approval List',
            columnWidths
        );
    }

}
