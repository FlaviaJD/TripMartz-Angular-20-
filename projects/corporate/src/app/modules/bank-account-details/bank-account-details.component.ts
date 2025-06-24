import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountDetailsService } from './bank-account-details.servise';

@Component({
    selector: 'app-bank-account-details',
    templateUrl: './bank-account-details.component.html',
    styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit {
    activeIdString;
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    userData: any;

    constructor(
        private BankAccountDetailsService: BankAccountDetailsService
    ) { }

    ngOnInit() {
    }

    activateTab(tab: string) {
        this.activeIdString=tab;
      }

    beforeChange($event) {
        
    }

    triggerTab(data: any) {
        if (data.data)
            this.userData = data.data;
        this.tabs.select(data.tabId);
    }

}
