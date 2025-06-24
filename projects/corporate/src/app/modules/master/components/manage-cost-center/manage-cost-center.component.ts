import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-cost-center',
  templateUrl: './manage-cost-center.component.html',
  styleUrls: ['./manage-cost-center.component.scss']
})
export class ManageCostCenterComponent implements OnInit {

  @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() { }

  ngOnInit(): void {
    
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
