import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material';
import { SettingService } from '../../../../settings/setting.service';
import { SwalService } from 'projects/corporate/src/app/core/services/swal.service';
import { UtilityService } from 'projects/corporate/src/app/core/services/utility.service';
import { ApiHandlerService } from 'projects/corporate/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterService } from '../../../master.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

    pageSize = 10;
    page = 1;
    collectionSize: number;
    displayColumn: { key: string, value: string }[] = [
        { key: "Slno", value: 'SNo.' },
        { key: "action", value: 'Actions' },
        { key: "employeeId", value: 'Employee Id' },
        { key: "name", value: 'Name' },
        { key: "position_name", value: 'Position' },
        { key: "department_name", value: 'Department' },
        { key: "email", value: 'Email' },
        { key: "business_number", value: 'Phone No.' },
      
        
    ];
    noData: boolean = true;
    respData: any;
    status;
    searchText:string='';
    userTitleList: Array<any> = [];
    private subSunk = new SubSink();

    @Output() toUpdate = new EventEmitter<any>();
    loggedInUser: any;

    constructor(
        private settingService: SettingService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandlerService: ApiHandlerService,
        private masterService:MasterService
    ) { 
        this.loggedInUser = JSON.parse(localStorage.getItem('currentCorpUser'));
        if(this.loggedInUser.auth_role_id==7){
            this.displayColumn.push({ key: "approvar", value: 'Manager' });
            this.displayColumn.push({ key: "status", value: 'Status' });
        }
        if (this.loggedInUser.auth_role_id == 10) {
            this.displayColumn.push({ key: "status", value: 'Status' });
        }
    }

    ngOnInit() {
        this.getEmployeeList();
        this.getTitleList();
        this.masterService.employeeUpdateData.next('')
    }

    getEmployeeList(): void {
        this.subSunk.sink = this.apiHandlerService.apiHandler('getEmployee', 'post', {}, {},{
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

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitleList', 'post', '', '').subscribe(res => {
            this.userTitleList= res.data
        });
    }

    title(targetId:any){
        for (let i = 0; i < this.userTitleList.length; i++) {
            if (this.userTitleList[i].id === targetId) {
                return this.userTitleList[i].title;
            }
        }
    }
    

    onEmployeeUpdate(data): void {
        this.masterService.employeeUpdateData.next(data);
        this.toUpdate.emit({ tabId: 'create/update_employee', data });
    }

    onEmployeeDelete(data){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteEmployee', 'post', {}, {},
                        {"id":data.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`Employee has been deleted successfully`);
                            this.getEmployeeList();
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

    onStatusChange(data) {

    }
    exportAsExcel(){
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "Employee Id": response.employeeId,
                "Name": `${this.title(response.title)} ${response.first_name} ${response.first_name}`,
                "Position": response.position_name,
                "Department": response.department_name,
                "Email": response.email,
                "Phone No.": response.business_number,
                "Manager": response.approvar || 'N/A',
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 20 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'Employee Master Report',
            columnWidths
        );
    }

}
