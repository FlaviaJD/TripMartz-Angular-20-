import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { CorporateCodeService } from './corporate-code.service';

@Component({
    selector: 'app-corporate-code',
    templateUrl: './corporate-code.component.html',
    styleUrls: ['./corporate-code.component.scss']
})
export class CorporateCodeComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "corporate_code_list";
    add:boolean=true;

    constructor(
        private route: ActivatedRoute,
        private corporateCodeService:CorporateCodeService
    ) { }

    ngOnInit() {
        this.resetValue();
        this.setSelectedTab();
    }

    setSelectedTab() {
        this.route.queryParams.subscribe(params => {
            if (params && params.tabId) {
                this.activeIdString = "add_update_corporate_code";
            }
        })
    }

    onTabSelected(event) {
        this.activeIdString = event.nextId;
        this.resetValue();
    }

    resetValue(){
        if (this.activeIdString == 'corporate_code_list') {
            this.corporateCodeService.updateData.next({});
        }
    }

    triggerTab(data: any) {
        if (data) {
            this.add=false;
            this.activeIdString = data.tabId;
            this.tabs.select(data.tabId);
        }
    }


}
