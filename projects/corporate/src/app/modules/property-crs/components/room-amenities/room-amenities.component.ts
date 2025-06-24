import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-room-amenities',
  templateUrl: './room-amenities.component.html',
  styleUrls: ['./room-amenities.component.scss']
})
export class RoomAmenitiesComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
      setTimeout(() => {
          this.tabs.select('roomAmenitiesList');
      });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        this.tabs.select(data.tabId);
    }

}
