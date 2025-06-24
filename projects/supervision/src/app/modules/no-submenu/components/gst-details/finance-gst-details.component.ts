import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gst-details',
  templateUrl: './finance-gst-details.component.html',
  styleUrls: ['./finance-gst-details.component.scss']
})
export class FinanceGstDetailsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "gst_list";
    
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.setSelectedTab();
    }

    setSelectedTab(){
        this.route.queryParams.subscribe(params => {
            if(params && params.tabId){
                this.activeIdString="add_update_gst";
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
