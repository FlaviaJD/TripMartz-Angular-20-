import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
      setTimeout(() => {
          this.tabs.select('roomTypeList');
      });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        this.tabs.select(data.tabId);
    }

}
