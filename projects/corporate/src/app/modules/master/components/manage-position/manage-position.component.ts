import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-position',
  templateUrl: './manage-position.component.html',
  styleUrls: ['./manage-position.component.scss']
})
export class ManagePositionComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    hotelData: any;
  
    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
        setTimeout(() => {
            this.tabs.select('positionList');
        });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        if (data)
        this.tabs.select(data.tabId);
    }

}
