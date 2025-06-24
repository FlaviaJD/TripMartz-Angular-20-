import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-static-page-content',
  templateUrl: './agent-static-page-content.component.html',
  styleUrls: ['./agent-static-page-content.component.scss']
})
export class AgentStaticPageContentComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "staticpage_list";
  constructor() { }

  ngOnInit() {
  }

  beforeChange(e){
      
  }

  triggerTab(data: any) {
    if (data) {
        this.tabs.select(data.tabId);
    }
}

}
