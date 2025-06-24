import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../../../payment.service';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { UtilityService } from 'projects/employee/src/app/core/services/utility.service';
import { Logger } from 'projects/employee/src/app/core/logger/logger.service';
import { Sort } from '@angular/material';
import { SubSink } from 'subsink';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';
import { HttpErrorResponse } from '@angular/common/http';

const log = new Logger('payment/SentBalanceRequestComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-sent-credit-limit',
    templateUrl: './sent-credit-limit.component.html',
    styleUrls: ['./sent-credit-limit.component.scss']
})
export class SentCreditLimitComponent implements OnInit, OnDestroy {
    private subSunk = new SubSink();
    pageSize = 100;
    page = 1;
    collectionSize: number = 10;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: 'Sl No.' },
        { key: 'system_transaction_id', value: 'System Transaction' },
        { key: 'amount', value: 'Amount' },
        { key: 'updated_datetime', value: 'Last Updated Date' },
        { key: 'last_deposit_amount', value: 'Last Deposit Amount' },
        { key: 'transaction_status', value: 'Status' },
        { key: 'created_datetime', value: 'Request Sent On' },
        { key: 'update_remarks', value: 'Remarks' },
    ];
    noData: boolean = true;
    currentBalance: any;

    constructor(
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
        private apiHandelerService: ApiHandlerService
    ) { }

    ngOnInit() {
        this.getBalanceRequestListAccountSys();
    }

    getCreditLimitManager() {
        this.subSunk.sink = this.apiHandelerService.apiHandler('creditLimitRequestListAccountSys', 'post', {}, {}, {})
            .subscribe(resp => {
                log.debug('resp', resp);
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.noData = false;
                    this.respData = resp.data || [];
                    respDataCopy = [...this.respData];
                } else {
                    this.noData = false;   
                    this.respData=[];
                }
            }, (err) => {
                this.noData = false;
                this.respData=[];
              })
    }

    getBalanceRequestListAccountSys() {
        this.subSunk.sink = this.apiHandelerService.apiHandler('creditLimitRequestListAccountSys', 'post', {}, {}, {})
            .subscribe(resp => {
                if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length>0) {
                    this.respData = resp.data || [];
                    this.noData = false;
                    respDataCopy = [...this.respData];
                       
                } else {
                    this.noData = false;
                    this.respData=[];
                }
            }, (err: HttpErrorResponse) => {
                this.noData = false;
                this.respData=[];
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                system_transaction_id: objData.system_transaction_id,
                amount: objData.amount,
                transaction_status: objData.status,
                transaction_type: objData.transaction_type,
                created_datetime: objData.created_datetime,
                update_remarks: objData.update_remarks,
                updated_datetime: objData.updated_datetime,
                remarks: objData.remarks,
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

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...respDataCopy];
        if (!sort.active || sort.direction === '') {
            this.respData = data;
            return;
        }
        this.respData = data.sort((a, b) => {
            const isAsc = sort.direction == 'asc';
            switch (sort.active) {
                case 'system_transaction_id': return this.utility.compare(' ' + a.system_transaction_id.toLocaleLowerCase(), ' ' + b.system_transaction_id.toLocaleLowerCase(), isAsc);
                case 'amount': return this.utility.compare(+ a.amount, + b.amount, isAsc);
                case 'transaction_status': return this.utility.compare(' ' + a.transaction_status.toLocaleLowerCase(), ' ' + b.transaction_status, isAsc);
                case 'transaction_type': return this.utility.compare(' ' + a.transaction_type.toLocaleLowerCase(), ' ' + b.transaction_type, isAsc);
                case 'created_datetime': return this.utility.compare(' ' + a.created_datetime.toLocaleLowerCase(), ' ' + b.created_datetime, isAsc);
                case 'update_remarks': return this.utility.compare(' ' + a.update_remarks.toLocaleLowerCase(), ' ' + b.update_remarks, isAsc);
                case 'updated_datetime': return this.utility.compare(' ' + a.updated_datetime.toLocaleLowerCase(), ' ' + b.updated_datetime, isAsc);
                // case 'remarks': return this.utility.compare(' ' + a.remarks.toLocaleLowerCase(), ' ' + b.remarks, isAsc);
                default: return 0;

                /*
                        
                */
            }
        });
    }

    ngOnDestroy() {
        this.subSunk.unsubscribe();
    }

}
