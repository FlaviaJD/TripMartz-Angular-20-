import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icic-hotel-list',
  templateUrl: './icic-hotel-list.component.html',
  styleUrls: ['./icic-hotel-list.component.scss']
})
export class IcicHotelListComponent implements OnInit {

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
