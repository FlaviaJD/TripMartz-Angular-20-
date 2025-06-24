import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agent-main-banner-image',
  templateUrl: './agent-main-banner-image.component.html',
  styleUrls: ['./agent-main-banner-image.component.scss']
})
export class AgentMainBannerImageComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "sliderimage_list";
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
