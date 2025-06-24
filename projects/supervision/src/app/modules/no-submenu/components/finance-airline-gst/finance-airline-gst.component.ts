import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FinanceAirlineGSTService } from './finance-airline-gst.service';

@Component({
  selector: 'finance-app-airline-gst',
  templateUrl: './finance-airline-gst.component.html',
  styleUrls: ['./finance-airline-gst.component.scss']
})
export class FinanceAirlineGstComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "corporate_code_list";
    add:boolean=true;

    constructor(
        private route: ActivatedRoute,
        private AirlineGSTService:FinanceAirlineGSTService
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
            this.AirlineGSTService.updateData.next({});
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
