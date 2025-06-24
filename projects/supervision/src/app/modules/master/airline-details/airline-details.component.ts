import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-airline-details',
  templateUrl: './airline-details.component.html',
  styleUrls: ['./airline-details.component.scss']
})
export class AirlineDetailsComponent implements OnInit {
  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  activeTab = "airline_list";

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
              this.activeTab = "add_update_airline";
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
