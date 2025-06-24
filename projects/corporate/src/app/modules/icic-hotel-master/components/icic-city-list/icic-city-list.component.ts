import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-icic-city-list',
  templateUrl: './icic-city-list.component.html',
  styleUrls: ['./icic-city-list.component.scss']
})
export class IcicCityListComponent implements OnInit {
@ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    setTimeout(() => {
        this.tabs.select('costCenterList');
    });
  }

  beforeChange(e) {
  }

  triggerTab(data: any) {
      if (data)
      this.tabs.select(data.tabId);
  }

}
