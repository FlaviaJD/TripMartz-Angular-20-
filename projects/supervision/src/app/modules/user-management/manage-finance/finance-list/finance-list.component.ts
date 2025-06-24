import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { SubSink } from 'subsink';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { UserManagementService } from '../../user-management.service';
import { HttpErrorResponse } from '@angular/common/http';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];


@Component({
    selector: 'app-finance-list',
    templateUrl: './finance-list.component.html',
    styleUrls: ['./finance-list.component.scss']
})
export class FinanceListComponent implements OnInit {
    @Output() b2bUserUpdate = new EventEmitter<any>();
    searchText: string="";
    respData: Array<any> = [];
    pageSize = 10;
    page = 1;
    loggedInUser: any;
    showConfirm: boolean = false;
    deleteUserData: any;
    private subSunk = new SubSink();
    userTypeList: any;
    noData:boolean = true;
    collectionSize:number = 50;
    listType: number;

    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'status', value: 'Status' },
        { key: 'name', value: 'Name' },
        { key: 'uuid', value: 'ID' },
        { key: 'company name', value: 'Company Name' },
        { key: 'user type', value: 'User Type' },
        { key: 'contact', value: 'Contact' },

    ];

    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'B2B-users-report',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    
    constructor( 
        private router: Router,
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private utility: UtilityService,private activatedRoute: ActivatedRoute,
        private exportAsService: ExportAsService,
        private userMangementService : UserManagementService) { }

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem('currentSupervisionUser')) || {};
        this.activatedRoute.queryParams.subscribe(params => {
            this.searchText="";
            this.listType = params['type'] == "active" ? 1 : 0;
            this.getUsersList(this.listType);
        });
        this.getTitleList();
        this.userMangementService.b2bUserUpdateData.next({});
    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id, '' + b.system_transaction_id, isAsc);
                case 'name': return this.utility.compare('' + a.first_name.toLocaleLowerCase(), '' + b.first_name.toLocaleLowerCase(), isAsc);
                case 'contact': return this.utility.compare(+ a.phone, + b.phone, isAsc);
                case 'email': return this.utility.compare('' + a.email.toLocaleLowerCase(), '' + b.email.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    pdfCallbackFn(pdf: any) {
        // example to add page number as footer to every page of pdf
        const noOfPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= noOfPages; i++) {
            pdf.setPage(i);
            pdf.text('Page ' + i + ' of ' + noOfPages, pdf.internal.pageSize.getWidth() - 40, pdf.internal.pageSize.getHeight() - 5);
        }
    }
    updateUser(data){
        this.userMangementService.b2bUserUpdateData.next(data);
    	this.b2bUserUpdate.emit({ tabId: 'add_update_finance', data });
    }

    deleteUser(){
    //     this.subSunk.sink = this.apiHandlerService.apiHandler('deleteUser', 'post', {}, {},
    //     {"id": this.deleteUserData.id })
    //     .subscribe(resp => {
    //         if (resp.statusCode == 200 || resp.statusCode == 201) {
    //             this.showConfirm=false;
    //             this.swalService.alert.success("User deleted successfully.");
    //             this.getUsersList(this.listType);
    //         }
    //         else {
    //             this.swalService.alert.oops();
    //         }
    //     }, (err: HttpErrorResponse) => {
    //         this.swalService.alert.oops();
    //     }
    //     );
    }


//  cancelDeletePopup(data) {
//         this.showConfirm = true;
//         this.deleteUserData = data;
//     }

    getTitleList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('userTitleList', 'post', {}, {}, {})
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.userTypeList = resp.data;
                } else {
                   
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            });
    }

    getTitleById(id) {
        let title = this.userTypeList.find( val => val.id == id );
        return title['title'] ? title['title'] : '';
    }

    exportExcel(): void {
        {
            const fileToExport = this.respData.map((response: any,index:number) => {
                return {
                    "Sl No.":index+1,
                    "Status": response.status == 0 ? 'Inactive' : 'Active',
                    "ID":response.uuid,
                    "Name":  this.getTitleById(response['title'])+'.'+response['first_name']+''+response['last_name'],
                    "Company Name": response['business_name'],
                    "UserType": "Corporate",
                    "Contact": response.phone+'- '+response.email,
                }
            });
            const columnWidths = [
                { wch: 5 },
                { wch: 10 },
                { wch: 20 },
                { wch: 30 },
                { wch: 20 },
                { wch: 50 }
            ];
            this.utility.exportToExcel(
                fileToExport,
                'Corporate List',
                columnWidths
            );
        }
    }

    getUsersList(type){
        this.noData = true;
        this.respData=[];
    	this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            {"status": type,"auth_role_id":GlobalConstants.FINANCE_AUTH_ROLE_ID})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData=[];
            });
    }

    onStatusChange(data) {
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateUserStatus', 'post', {}, {},
            { "status": data.status==1 ? 0 : 1, "id": data.id })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.success("User status changed successfully.");
                    this.getUsersList(this.listType);
                }
                else {
                    this.swalService.alert.oops();
                }
            }, (err: HttpErrorResponse) => {
                console.error(err);
                this.swalService.alert.oops();
            }
            );
    }

    hide() {
        this.showConfirm = false;
    }
}
