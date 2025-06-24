import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { CurrencyConversionService } from './currency-conversion.service';
import { Sort } from '@angular/material';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';

const log = new Logger('CurrencyConversionComponent');
let filterArray: Array<any> = [];
let currencyConverisonDataCopy: Array<any> = []

@Component({
    selector: 'app-currency-conversion',
    templateUrl: './currency-conversion.component.html',
    styleUrls: ['./currency-conversion.component.scss']
})
export class CurrencyConversionComponent implements OnInit, OnDestroy {

    pageSize = 10;
    page = 1;
    collectionSize;
    noData: boolean = true;
    currencyConverisonData: object[];
    displayColumn: { key: string, value: string }[] = [{ key: 'id', value: 'Sl No.' }, { key: 'currency', value: 'Currency' }, { key: 'status', value: 'Status' },{ key: 'Conversion Rate', value: 'Conversion Rate' },{ key: 'action', value: 'Action' }];
    status;
    
    constructor(
        private apiHandlerService: ApiHandlerService,
        private currencyConversionService: CurrencyConversionService,
        private swalService: SwalService,
    ) { }

    ngOnInit() {
       this.currencyConverisonResponse();
    }

    currencyConverisonResponse(){
        this.noData=true;
        this.currencyConverisonData=[];
        this.apiHandlerService.apiHandler('currencyConverison', 'post').subscribe(resp => {
            if (resp['Status'] && resp['data']) {
                this.noData = false;
                this.currencyConverisonData = resp['data'];
                this.collectionSize = this.currencyConverisonData.length;
                currencyConverisonDataCopy = [...this.currencyConverisonData];
            }
            else{
                this.noData=false;
                this.currencyConverisonData=[];
            }
        }, (err) => {
            this.noData = false;
            this.currencyConverisonData=[];
        });
    }
   

    applyFilter(text: string) {
        text = text.toLocaleLowerCase().trim();
        filterArray = currencyConverisonDataCopy.slice().filter((objData, index) => {
            // keys that are required to filter.
            let filterKeys = {
                id: objData.id,
                currency: objData.currency
            };
            if (Object.values(filterKeys).join().toLocaleLowerCase().match(`${text}`)) {
                return objData;
            }
        });
        if (filterArray.length && text.length)
            this.currencyConverisonData = filterArray;
        else
            this.currencyConverisonData = !filterArray.length && text.length ? filterArray : [...currencyConverisonDataCopy];

    }

    sortData(sort: Sort) {
        const data = filterArray.length ? filterArray : [...currencyConverisonDataCopy];
        if (!sort.active || sort.direction === '') {
            this.currencyConverisonData = data;
            return;
        }
        this.currencyConverisonData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'id': return compare(+a.id, +b.id, isAsc);
                case 'currency': return compare(a.currency, b.currency, isAsc);
                case 'status': return compare(a.status, b.status, isAsc);
                case 'action': return compare(a.action, b.action, isAsc);
                default: return 0;
            }
        });
    }

    onUpdate(doc) {
        doc = {
            "currency_id": doc.id.toString(),
            "value": doc.value.toString(),
            "status": doc.status,
            "currency":doc.currency
        }
        this.currencyConversionService.update(doc).subscribe(resp => {
                if (resp.statusCode == 200){ 
                    this.swalService.alert.success("Data updated successfully.");
                    this.currencyConverisonResponse();
                }
                else if (resp.statusCode != 200)
                    this.swalService.alert.oops();
            }, (err) => {
                if (err && err.error && err.error && err.error.Message) {
                    this.swalService.alert.oops(err.error.Message);
                }
            });
    }

    onUpdateStatus(event,data){
        if(event && event.checked){
            data.status=1;
        }
        else{
            data.status=0;
        }
    }
    
    ngOnDestroy() {
    }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function getData() {
    return [
        {
            Sno: 1,
            Currency: 'AUD',
            Status: true,
            Action: 'Update'
        },
        {
            Sno: 2,
            Currency: 'USD',
            Status: true,
            Action: 'Update'
        },
        {
            Sno: 3,
            Currency: 'BBD',
            Status: true,
            Action: 'Update'
        }
    ]
}
