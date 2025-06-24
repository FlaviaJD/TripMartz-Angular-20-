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
let filterArray: Array<any> = [];


@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.scss']
})
export class StateListComponent implements OnInit {
        @Output() stateUpdate = new EventEmitter<any>();
        searchText: string = "";
        pageSize = 50;
        page = 1;
        collectionSize: number = 40;
        private subSunk = new SubSink();
        stateList:any=[];
        noData: boolean = true;
        stateConfig: FormGroup;
    
        displayColumn: { key: string, value: string }[] = [
            { key: 'id', value: 'Sl No.' },
            { key: 'action', value: 'Action' },
            { key: 'name', value: 'State Name' },
            { key: 'state_code', value: 'State Code' },
            { key :'state_id', value:'State Id'},
            { key: 'xlpro_state_code', value: 'Xlpro State Code' },
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
            this.masterService.stateUpdateData.next('');
            this.setSearchForm();
            this.getStateList();
        }
    
        setSearchForm(){
            this.stateConfig = this.fb.group({
                state_name: new FormControl(''),
                state_code: new FormControl(''),
                status: new FormControl('')
            });
        }
    
        getStateList(): void {
            this.subSunk.sink = this.apiHandlerService.apiHandler('getState', 'post', {}, {},{
            })
              .subscribe(res => {
                  if (res.statusCode == 200 || res.statusCode == 201) {
                    this.stateList=res.data;
                    this.noData=false;
                    this.collectionSize = res.data.length;
                  }
                },(err: HttpErrorResponse) => {
                    this.swalService.alert.error(err['error']['Message']);
             });
        }
    
        updateUser(data){
            this.masterService.stateUpdateData.next(data);
            this.stateUpdate.emit({ tabId: 'add_update_state', data });
        }
    
        exportExcel(): void {
            const fileToExport = this.stateList.map((response: any, index: number) => {
                return {
                    "Sl No.": index + 1,  
                    "State Name": response.name || 'N/A',
                    "State Code": response.state_code || 'N/A',
                    "State Id":response.state_id || 'N/A',
                    "Xlpro State Code": response.xlpro_state_code || 'N/A',
                    "Status": response.status     
                }
            });
    
            const columnWidths = [ 
                { wch: 5 },
                { wch: 20 },
                { wch: 30 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 10 }
            ];
    
            this.utility.exportToExcel(
                fileToExport,
                'State Master Report',
                columnWidths
            );
        }
    
        download(type: SupportedExtensions, orientation?: string) {
           
        }

        applyFilter(text: string) {
            text = text.toLocaleLowerCase().trim();
            filterArray = this.stateList.slice().filter((objData, index) => {
                const filterOnFields = {
                    name: objData.name,
                    state_code: objData.state_code,
                    state_id:objData.state_id,
                    xlpro_state_code:objData.xlpro_state_code,
                    status:objData.status
                }
                if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                    return objData;
                }
            });
            if (filterArray.length && text.length)
                this.stateList = filterArray;
            else
                this.stateList = !filterArray.length && text.length ? filterArray : [...this.stateList];
        }

        sortData(sort: Sort) {
            const data = filterArray.length ? filterArray : [...this.stateList];
            if (!sort.active || sort.direction === '') {
                this.stateList = data;
                return;
            }
            this.stateList = data.sort((a, b) => {
                const isAsc = sort.direction === 'asc';
                switch (sort.active) {
                    case 'name': return this.utility.compare('' + a.name, '' + b.name, isAsc);
                    case 'state_code': return this.utility.compare('' + a.state_code, '' + b.state_code, isAsc);
                    case 'state_id': return this.utility.compare('' + a.state_id, '' + b.state_id, isAsc);
                    case 'xlpro_state_code': return this.utility.compare('' + a.xlpro_state_code, '' + b.xlpro_state_code, isAsc);
                    case 'status': return this.utility.compare('' + a.status, '' + b.status, isAsc);
                    default: return 0;
                }
            });
        }
        onStateSearch(){
    
        }
    
        onReset(){
            
        }
    
        ngOnDestroy(): void {
            this.subSunk.unsubscribe();
        }
    
    }

