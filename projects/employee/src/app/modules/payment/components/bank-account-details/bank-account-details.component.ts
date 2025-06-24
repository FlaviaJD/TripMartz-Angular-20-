import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Logger } from 'projects/employee/src/app/core/logger/logger.service';
import { PaymentService } from '../../payment.service';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { UtilityService } from 'projects/employee/src/app/core/services/utility.service';
import { Sort } from '@angular/material';
import { untilDestroyed } from 'projects/employee/src/app/core/services';


const log = new Logger('payment/BankAccountDetailsComponent');
let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
    selector: 'app-bank-account-details',
    templateUrl: './bank-account-details.component.html',
    styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit, OnDestroy {

    @Output() passedTab = new EventEmitter<any>();
    pageSize = 6;
    page = 1;
    collectionSize: number;
    status: boolean;
    respData: any;
    displayColumn: { key: string, value: string }[] = [
        { key: 'id', value: '#' },
        { key: 'banklogo', value: 'Bank Logo' },
        { key: 'accountname', value: 'Account Name' },
        { key: 'accountnumber', value: 'Account Number' },
        { key: 'bankname', value: 'Bank Name' },
        { key: 'branchname', value: 'Branch Name' },
        { key: 'ifsccode', value: 'IFS Code' },
    ];
    noData: boolean = true;

    constructor(
        private paymentService: PaymentService,
        private swalService: SwalService,
        private utility: UtilityService,
    ) { }

    ngOnInit() {
        this.getBankAccountDetails();
    }

    getBankAccountDetails() {
        const data = [{}];
        data['topic'] = 'bankAccountDetails';
        this.paymentService.fetch(data)
            .pipe(untilDestroyed(this))
            .subscribe(resp => {
                log.debug('resp', resp);
                if (resp.statusCode == 200) {
                    this.noData = false;
                    this.respData = resp.data;
                    respDataCopy = [...this.respData];
                    this.collectionSize = respDataCopy.length;
                }
            })
    }

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = respDataCopy.slice().filter((objData, index) => {
            const filterOnFields = {
                accountname: objData.accountname,
                accountnumber: objData.accountnumber,
                bankname: objData.bankname,
                branchname: objData.branchname,
                ifsccode: objData.ifsccode,
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
                case 'accountname': return this.utility.compare(' '+a.accountname.toLocaleLowerCase(), ' '+b.accountname.toLocaleLowerCase(), isAsc);
                case 'accountnumber': return this.utility.compare(+a.accountnumber, +b.accountnumber, isAsc);
                case 'bankname': return this.utility.compare(' '+a.bankname.toLocaleLowerCase(), ' '+b.bankname.toLocaleLowerCase(), isAsc);
                case 'branchname': return this.utility.compare(' '+a.branchname.toLocaleLowerCase(), ' '+b.branchname.toLocaleLowerCase(), isAsc);
                case 'ifsccode': return this.utility.compare(' '+a.ifsccode.toLocaleLowerCase(), ' '+b.ifsccode, isAsc);
                default: return 0;
            }
        });
    }

    ngOnDestroy() { }
}
