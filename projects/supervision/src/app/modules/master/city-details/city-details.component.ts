import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html',
  styleUrls: ['./city-details.component.scss']
})
export class CityDetailsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeTab = "city_list";
  
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
                this.activeTab = "add_update_city";
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
