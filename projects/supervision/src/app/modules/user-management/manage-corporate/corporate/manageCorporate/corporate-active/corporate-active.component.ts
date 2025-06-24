import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-corporate-active',
    templateUrl: './corporate-active.component.html',
    styleUrls: ['./corporate-active.component.scss']
})
export class CorporateActiveComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "b2cUsers_list";
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
