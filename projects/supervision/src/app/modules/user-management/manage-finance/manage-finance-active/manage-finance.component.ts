import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-manage-finance.component',
    templateUrl: './manage-finance.component.html',
    styleUrls: ['./manage-finance.component.scss']
})
export class ManageFinanceComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "finance_list";
    test: boolean;
    constructor() { }

    ngOnInit() {
    }

    beforeChange(e) {
    }

    triggerTab(data: any) {
        if (data) {
            this.tabs.select(data.tabId);
        }
    }

}
