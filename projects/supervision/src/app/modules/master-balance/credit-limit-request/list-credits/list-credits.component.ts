import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHandlerService } from '../../../../core/api-handlers';
import { SwalService } from '../../../../core/services/swal.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { Logger } from '../../../../core/logger/logger.service';
import { SubSink } from 'subsink';
import { Sort } from '@angular/material';
import { MatModalService, ModalConfigDataI, ModalConfigDefault } from '../../../../core/services/mat-modal.service';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProcessTransactionBalanceComponent } from '../../modals/process-transaction-balance/process-transaction-balance.component';
import { formatDate } from 'ngx-bootstrap/chronos';
import { ExportAsConfig, ExportAsService, SupportedExtensions } from 'ngx-export-as';
import { GlobalConstants } from 'projects/supervision/src/app/core/services/global-constants';
import { map, startWith } from 'rxjs/operators';

const log = new Logger('NoSubMenu/TransactionLogsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-list-credits',
    templateUrl: './list-credits.component.html',
    styleUrls: ['./list-credits.component.scss']
})
export class ListCreditsComponent implements OnInit {
    filteredCorp: Observable<string[]>;
    private subSunk = new SubSink();
    searchForm: FormGroup;
    searchText: string;
    isOpen = false as boolean;
    bsDateConf = {
        isAnimated: true,
        dateInputFormat: 'YYYY-MM-DD',
        rangeInputFormat: 'YYYY-MM-DD',
        containerClass: 'theme-blue',
        showWeekNumbers: false
    };
    maxDate=new Date();
    pageSize = 10;
    page = 1;
    collectionSize: number;
    agentList: any;
    config: ExportAsConfig = {
        type: 'pdf',
        elementIdOrContent: 'credit-request',
        options: {
            jsPDF: {
                orientation: 'landscape'
            },
            pdfCallbackFn: this.pdfCallbackFn // to add header and footer
        }

    };
    filteredAgent: Observable<string[]>;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'action', value: 'Action' },
        { key: 'transaction_status', value: 'Status' },
        { key: 'system_transaction_id', value: 'System Transaction' },
        { key: 'uuid', value: 'User Id' },
        { key: 'business_name', value: 'Company Name' },
        { key: 'amount', value: 'Amount' },
        { key: 'date_of_transaction', value: 'Request Sent On' },
        { key: 'remarks', value: 'User Remarks' },
        { key: 'update_remarks', value: 'Update Remarks' },
    ];
    noData: boolean = false;
    respData: Array<any> = [];
    modalConfigData: ModalConfigDataI;
    subscription: Subscription
    corporateId: string;
    corporateList: any;
    agentId: string='';

    constructor(
        private apiHandlerService: ApiHandlerService,
        private fb: FormBuilder,
        private swalService: SwalService,
        private utility: UtilityService,
        private exportAsService: ExportAsService,
        private matModalService: MatModalService
    ) {
        this.modalConfigData = ModalConfigDefault;
    }
    ngOnInit() {
        this.searchForm = this.fb.group({
            fromDate: new FormControl('', [Validators.maxLength(120)]),
            toDate: new FormControl('', [Validators.maxLength(120)]),
            transactionId: new FormControl('', [Validators.maxLength(50), Validators.pattern('^([-A-Za-z0-9]){1,50}$')]),
            bookingStatus: new FormControl('', [Validators.maxLength(120)]),
            bookedBy: new FormControl('', [Validators.maxLength(120)]),
            bookedByAgent: new FormControl('', [Validators.maxLength(120)]),
        });
        this.getAgentsList();
        this.getCorporateList();
        this.getTransactionLogs();
    }

    getCorporateList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.CORPORATE_AUTH_ROLE_ID })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.corporateList = resp.data || [];
                    this.setCorporate();
                }
            });
    }

    getAgentsList() {
        this.subSunk.sink = this.apiHandlerService.apiHandler('b2cUsersList', 'post', {}, {},
            { "status": 1, "auth_role_id": GlobalConstants.AGENT_AUTH_ROLE_ID })
            .subscribe(resp => {
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.agentList = resp.data || [];
                    this.setAgent();
                }
                else {

                }
            });
    }

    setCorporate() {
        this.filteredCorp = this.searchForm.controls.bookedBy.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }
    

    setAgent() {
        this.filteredAgent = this.searchForm.controls.bookedByAgent.valueChanges.pipe(
            startWith(''),
            map(value => this._filterAgent(value || '')),
        );
    }

    _filterAgent(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.agentList.filter(option => (option.business_name + ' (' + option.uuid + ')').toLowerCase().includes(filterValue));
    }
    

_filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.agentList.filter(option => (option.business_name + ' (' + option.uuid + ')').toLowerCase().includes(filterValue));
}

    onSearchSubmit() {
        this.getTransactionLogs();
    }

    onReset() {
        this.corporateId='';
        this.agentId='';
        this.searchForm.reset();
        this.searchForm.patchValue({
            bookingStatus: '',
            bookedBy: ''
        });
        this.searchText="";
        this.getTransactionLogs();
    }

    openDialog(whichComponent, data?: any) {
        this.modalConfigData.width = '600px';
        this.modalConfigData.data = data || '';
        switch (whichComponent) {
            case 1: this.modalConfigData.component = ProcessTransactionBalanceComponent;
                break;
        }
        this.matModalService.openDialog(this.modalConfigData);
        this.getData();
    }

    onValueChangeAgent(value) {
        if (value == '') {
            this.agentId = '';
        }
    }

    onAgentSelectionChanged(event) {
        this.agentId = event.option.id;
    }
    
    getData() {
        this.subscription = this.matModalService.getData().subscribe(res => {
            if (!res.noData) {
                this.subscription.unsubscribe();
                log.debug('data found', res);
                this.updateProcess(res);
            } else {
                this.subscription.unsubscribe();
                log.debug('no data found', res);
            }
        })
    }

    updateProcess(res) {
        const req = {
            "id": res['id'],
            "transaction_status": res['status'],
            "update_remarks": res['remarks']
        }
        this.subSunk.sink = this.apiHandlerService.apiHandler('updateCreditLimit', 'post', {}, {}, req)
            .subscribe(resp => {
                log.debug('processAgentBalance after update', resp)
                if (resp.statusCode == 200 || resp.statusCode == 201) {
                    this.swalService.alert.update('Your Amount has been updated successfully')
                } else {
                    this.swalService.alert.oops(resp.msg || '')
                }
                this.getTransactionLogs();
            }, (err: HttpErrorResponse) => {
                this.swalService.alert.oops()
            })
    }

    getTransactionLogs() {
        this.respData=[];
        this.noData = true;
        this.subSunk.sink = this.apiHandlerService.apiHandler('creditLimitReqList', 'post', {}, {},
            {
                "requested_date_from": this.searchForm.value.fromDate ? formatDate(this.searchForm.value.fromDate, 'YYYY-MM-DD') : "",
                "requested_date_to": this.searchForm.value.toDate ? formatDate(this.searchForm.value.toDate, 'YYYY-MM-DD') : "",
                "transaction_status": this.searchForm.value.bookingStatus || "",
                "system_transaction_id": this.searchForm.value.transactionId || "",
                "auth_user_id": this.corporateId || "",
            }
        )
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
                else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err: HttpErrorResponse) => {
                this.noData = false;
                this.respData=[];
            });
    }


    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                agent: objData.agent,
                transactiondate: objData.transaction,
                app_refernce: objData.app_refernce,
                transactiontype: objData.transactiontype,
                fare: objData.fare,
                remarks: objData.remarks
            }
            if (Object.values(filterOnFields).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.respData = filterArray;
        else
            this.respData = !filterArray.length && text.length ? filterArray : [...respDataCopy];

    }

    download(type: SupportedExtensions, orientation?: string) {
        let filename = this.collectionSize == 1 ? "" : "";
        this.config.type = type;
        if (orientation) {
            this.config.options.jsPDF.orientation = orientation;
        }
        const date = new Date().toDateString();
        this.exportAsService.save(this.config, filename).subscribe((_) => {
            // save started
            this.swalService.alert.success();
        }, (err) => {
            this.swalService.alert.oops();

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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare('' + a.system_transaction_id.toLocaleLowerCase(), '' + b.system_transaction_id.toLocaleLowerCase(), isAsc);
                case 'transaction_type': return this.utility.compare('' + a.transaction_type, '' + b.transaction_type, isAsc);
                case 'transaction_owner_id': return this.utility.compare('' + a.transaction_owner_id, '' + b.transaction_owner_id, isAsc);
                case 'transaction_status': return this.utility.compare('' + a.transaction_status.toLocaleLowerCase(), '' + b.transaction_status.toLocaleLowerCase(), isAsc);
                case 'amount': return this.utility.compare(+a.amount, +b.amount, isAsc);
                case 'bank': return this.utility.compare('' + a.bank.toLocaleLowerCase(), '' + b.bank.toLocaleLowerCase(), isAsc);
                case 'transaction_number': return this.utility.compare('' + a.transaction_number.toLocaleLowerCase(), '' + b.transaction_number.toLocaleLowerCase(), isAsc);
                case 'date_of_transaction': return this.utility.compare('' + a.date_of_transaction.toLocaleLowerCase(), '' + b.date_of_transaction.toLocaleLowerCase(), isAsc);
                case 'update_remarks': return this.utility.compare('' + a.update_remarks.toLocaleLowerCase(), '' + b.update_remarks.toLocaleLowerCase(), isAsc);
                case 'remarks': return this.utility.compare('' + a.remarks.toLocaleLowerCase(), '' + b.remarks.toLocaleLowerCase(), isAsc);
                default: return 0;
            }
        });
    }

    receiveSearchValues($event) {
        let resultData = [];
        this.respData = respDataCopy;
        if ($event.fromDate && $event.toDate || $event.transactionId) {
            if ($event.fromDate && $event.toDate) {
                resultData = this.respData.filter(function (a) {
                    return Number(new Date(a.date_of_transaction).getTime()) >= Number(new Date($event.fromDate).getTime()) && Number(new Date(a.date_of_transaction).getTime()) <= Number(new Date($event.toDate).getTime());
                });
            } if ($event.transactionId) {
                resultData = this.respData.filter(b => {
                    return b.system_transaction_id == $event.transactionId;
                })
            }
            this.respData = resultData;
            this.collectionSize = respDataCopy.length;
        } else {
            this.getTransactionLogs();
        }
    }
   
    exportExcel(): void { 
        const fileToExport = this.respData.map((response: any, index: number) => {
            return {
                "Sl No.":index+1,
                "Status": response.transaction_status,
                "System Transaction": response.system_transaction_id,
                "User Id": response.authUser.uuid,
                "Agency Name": response.authUser.business_name,
                "Agent Name": response.authUser.first_name+" "+response.authUser.middle_name+" "+response.authUser.last_name,
                "Amount": response.amount,
                "Last Deposit Date": response.last_deposit_date,
                "Last Deposit Amount":response.last_deposit_amount,
                "Credit Already Due":response.credit_already_due,
                "Request Sent On": response.date_of_transaction,
                "User Remarks": response.remarks,
                "Update Remarks": response.update_remarks
            }
        });
        const columnWidths = [
            { wch: 5 },
            { wch: 10 },
            { wch: 30 },
            { wch: 20 },
            { wch: 40 },
            { wch: 40 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 50 },
            { wch: 50 }
        ];
        this.utility.exportToExcel(
         fileToExport,
         'Credit limit Request',
         columnWidths
       );
      }

      onSelectionChanged(event) {
        this.corporateId= event.option.id;
    }

    onValueChange(value) {
        if (value == '') {
            this.corporateId = '';
        }
    }

    ngOnDestroy(): void {
        this.subSunk.unsubscribe();
    }
}
