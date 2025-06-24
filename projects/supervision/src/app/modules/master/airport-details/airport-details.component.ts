import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-airport-details',
    templateUrl: './airport-details.component.html',
    styleUrls: ['./airport-details.component.scss']
})
export class AirportDetailsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeTab = "airport_list";

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
                this.activeTab = "add_update_airport";
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
