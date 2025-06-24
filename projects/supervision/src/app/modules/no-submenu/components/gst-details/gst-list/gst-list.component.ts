import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material';
import { ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { GstService } from '../gst.service';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
let filterArray: Array<any> = [];

@Component({
    selector: 'app-gst-list',
    templateUrl: './gst-list.component.html',
    styleUrls: ['./gst-list.component.scss']
})
export class GstListComponent implements OnInit {
    @Output() gstUpdate = new EventEmitter<any>();
    searchText: string = "";
    pageSize = 50;
    page = 1;
    collectionSize: number = 40;
    private subSunk = new SubSink();
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
    respData:any=[];
    noData: boolean = true;
    userTitleList:Array<any>=[];
    regConfig: FormGroup;
    filteredCorp: Observable<string[]>;
    corporateList: Array<any> = [];
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'client_name', value: 'Client Name' },
        { key: 'client_code', value: 'Client Code' },
        { key: 'gst_number', value: 'GST Number' },
        { key: 'client_address', value: 'Address' },
        { key: 'gst_ph_number', value: 'GST Phone' },
        { key: 'gst_email_id', value: 'GST Email Id' },
        { key: 'gst_state', value: 'State Name' },
        { key: 'gst_for', value: 'Module' },
        { key: 'type', value: 'Type' },
    ];
    client_id: any="All";

    constructor(
        private utility: UtilityService,
        private fb: FormBuilder,
        private apiHandlerService:ApiHandlerService,
        private swalService:SwalService,
        private gstService:GstService
    ) { }

    ngOnInit() {
        this.setSearchForm();
        this.getClientList();
        this.setClient();
        this.getGstList();
        this.getTitleList();
        this.gstService.gstUpdateData.next('');
    }

    setSearchForm(){
        this.regConfig = this.fb.group({
            client_name: new FormControl('', [Validators.maxLength(120)]),
            module: new FormControl('All', [Validators.maxLength(120)]),
            type: new FormControl('All', [Validators.maxLength(120)]),
        });
    }

    getGstList(): void {
        let request = this.regConfig.value;
        request.client_name == '' ? request.client_id = 'All' : request.client_id = this.client_id
        delete request.client_name;
        this.subSunk.sink = this.apiHandlerService.apiHandler('getGst', 'post', {}, {}, request
        )
            .subscribe(res => {
                if (res.statusCode == 200 || res.statusCode == 201) {
                    this.respData = res.data;
                    this.noData = false;
                    this.collectionSize = res.data.length;
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
    }

    deleteGst(gstData){
        this.swalService.alert.delete((action)=>{
            if(action){
                this.subSunk.sink = this.apiHandlerService.apiHandler('deleteGst', 'post', {}, {},
                        {"id":gstData.id})
                        .subscribe(response => {
                            if (response.statusCode == 200 || response.statusCode == 201 && response.data) {
                            this.swalService.alert.success(`GST has been deleted successfully`);
                            this.getGstList();
                            }
                        },(err: HttpErrorResponse) => {
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
    	// this.gstUpdate.emit({ tabId: 'add_update_gst', data });
        this.gstService.gstUpdateData.next(data);
        this.gstUpdate.emit({ tabId: 'add_update_gst', data });
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

    getFullName(title,firstName,lastName){
        const personTitle=this.title(title)
        return `${personTitle} ${firstName} ${lastName}`;
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
                case 'client_name': return this.utility.compare('' + a.client_name, '' + b.client_name, isAsc);
                case 'client_code': return this.utility.compare('' + a.client_code, '' + b.client_code, isAsc);
                case 'gst_number': return this.utility.compare('' + a.gst_number, '' + b.gst_number, isAsc);
                case 'client_address': return this.utility.compare('' + a.client_address, '' + b.client_address, isAsc);
                case 'gst_ph_number': return this.utility.compare('' + a.client_name, '' + b.client_name, isAsc);
                case 'gst_email_id': return this.utility.compare('' + a.gst_email_id, '' + b.gst_email_id, isAsc);
                case 'gst_state': return this.utility.compare('' + a.client_name, '' + b.client_name, isAsc);
                case 'gst_for': return this.utility.compare('' + a.gst_for, '' + b.gst_for, isAsc);
                case 'type': return this.utility.compare('' + a.type, '' + b.type, isAsc);
                default: return 0;
            }
        });
    }

    exportExcel(): void {
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.": index + 1,  
                "Client Name":response.client_name || 'N/A',
                "Client Code":response.client_code || 'N/A',
                "GST Number": response.gst_number || 'N/A',
                "Address": response.client_address || 'N/A',
                "GST Phone": response.gst_ph_number || 'N/A',
                "GST Email Id": response.gst_email_id || 'N/A',
                "State Name": response.gst_state || 'N/A',
                "Module": response.gst_for || 'N/A',
                "Type":response.type  || 'N/A' 
            }
        });

        const columnWidths = [ 
            { wch: 5 },
            { wch: 20 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 },
            { wch: 30 }
        ];

        this.utility.exportToExcel(
            fileToExport,
            'GST Report',
            columnWidths
        );
    }

    download(type: SupportedExtensions, orientation?: string) {
       
    }

    onReset(){
        this.ngOnInit();
    }

    getClientList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.CORPORATE_AUTH_ROLE_ID })
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
                    this.corporateList = resp.data || [];
                    this.setClient();
                }
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.error(err['error']['Message']);
            });
    }

    setClient() {
        this.filteredCorp = this.regConfig.controls.client_name.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.corporateList.filter((option:any )=> (option.business_name+' ('+option.id+')').toLowerCase().includes(filterValue));
    }

    onSelectionChanged(event) {
        this.client_id = event.option.id.toString();
    }
   

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }


}
