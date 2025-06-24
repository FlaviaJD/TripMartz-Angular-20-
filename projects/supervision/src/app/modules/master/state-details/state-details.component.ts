import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-state-details',
  templateUrl: './state-details.component.html',
  styleUrls: ['./state-details.component.scss']
})
export class StateDetailsComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeTab = "state_list";

    constructor(
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.setSelectedTab();
    }

    setSelectedTab() {
        this.route.queryParams.subscribe(params => {
            if (params && params.tabId) {
                this.activeTab = "add_update_state";
            }
        })
    }

    beforeChange(e) {
    }

    triggerTab(data: any) {
        if (data) {
            this.tabs.select(data.tabId);
        }
    }

}
