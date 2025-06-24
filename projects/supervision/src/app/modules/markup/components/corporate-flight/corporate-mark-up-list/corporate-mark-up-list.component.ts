import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Sort } from '@angular/material';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SubSink } from 'subsink';
import { MarkupService } from '../../../markup.service';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';

let filterArray: Array<any> = [];
let respDataCopy: Array<any> = [];

@Component({
  selector: 'app-corporate-mark-up-list',
  templateUrl: './corporate-mark-up-list.component.html',
  styleUrls: ['./corporate-mark-up-list.component.scss']
})
export class CorporateMarkUpListComponent implements OnInit {

  @Output() toUpdate = new EventEmitter<any>();
  private subSunk = new SubSink();
  searchForm: FormGroup;
  isOpen = false as boolean;
  bsDateConf = {
    isAnimated: true,
    dateInputFormat: 'YYYY-MM-DD',
    rangeInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-blue'
  };
  pageSize = 100;
  page = 1;
  collectionSize: number = 100;
  displayColumn: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'action', value: 'Action' },
    { key: 'corporate_ame', value: 'Corporate Name' },
    { key: 'airline_type', value: 'Airline Type' },
    { key: 'airline_name', value: 'Airline Name' },
    { key: 'fare_type', value: 'Fare Type' },
    { key: 'markup_type', value: 'Markup Type' },
    { key: 'markup_value', value: 'Markup Value' }

  ];


  displayCorporateList: { key: string, value: string }[] = [
    { key: 'id', value: 'Sl No.' },
    { key: 'action', value: 'Action' },
    { key: 'corporate_ame', value: 'Corporate Name' },
    { key: 'uuid', value: 'User ID' },
    { key: 'name', value: 'Corporate Head Name' },

  ];
  noData: boolean = true;
  respData: Array<any> = [];

  constructor(
    private apiHandlerService: ApiHandlerService,
    private utility: UtilityService,
    private markupService: MarkupService,
  ) { }

  ngOnInit() {
    this.markupService.toUpdateData.next({});
    this.getCorporateMarkupList();
  }

  getCorporateMarkupList() {
    this.respData = [];
    this.noData = true;
    let req = { module_type: 'corporate_flight' };
    this.subSunk.sink = this.apiHandlerService.apiHandler('markUpList', 'post', {}, {}, req).subscribe(resp => {
      if ((resp.statusCode == 200 || resp.statusCode == 201) && resp.data && resp.data.length > 0) {
        this.noData = false;
        this.respData = resp.data || [];
        respDataCopy = JSON.parse(JSON.stringify(resp.data));
        this.collectionSize = resp.data.length;
      }
      else {
        this.respData = [];
        this.noData = false;
      }
    }, (err) => {
      this.noData = false;
      this.respData = [];
    });
  }

  viewCommission(data) {
    this.markupService.agentMarkupDetails.next(data);
    this.toUpdate.emit({ tabId: 'markup_detail', data });
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
        case 'bank_name': return this.utility.compare('' + a.bank_name.toLocaleLowerCase(), '' + b.bank_name.toLocaleLowerCase(), isAsc);
        case 'branch_name': return this.utility.compare('' + a.branch_name, '' + b.branch_name, isAsc);
        case 'account_name': return this.utility.compare('' + a.account_name, '' + b.account_name, isAsc);
        case 'account_number': return this.utility.compare(+ a.account_number.toLocaleLowerCase(), + b.account_number.toLocaleLowerCase(), isAsc);
        case 'swift_code': return this.utility.compare(+a.swift_code, +b.swift_code, isAsc);
        case 'ssn': return this.utility.compare('' + a.ssn.toLocaleLowerCase(), '' + b.ssn.toLocaleLowerCase(), isAsc);
        case 'created_on': return this.utility.compare('' + a.created_on.toLocaleLowerCase(), '' + b.created_on.toLocaleLowerCase(), isAsc);
        case 'status': return this.utility.compare('' + a.status.toLocaleLowerCase(), '' + b.status.toLocaleLowerCase(), isAsc);
        default: return 0;
      }
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

}
