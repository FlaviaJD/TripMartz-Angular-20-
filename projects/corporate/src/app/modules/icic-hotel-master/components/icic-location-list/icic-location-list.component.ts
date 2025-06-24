import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icic-location-list',
  templateUrl: './icic-location-list.component.html',
  styleUrls: ['./icic-location-list.component.scss']
})
export class IcicLocationListComponent implements OnInit {

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
      //   console.log('tab changed',e)
    }
  
    triggerTab(data: any) {
        if (data)
        this.tabs.select(data.tabId);
    }
  

}

