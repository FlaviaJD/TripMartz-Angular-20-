import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-property-amenities',
  templateUrl: './property-amenities.component.html',
  styleUrls: ['./property-amenities.component.scss']
})
export class PropertyAmenitiesComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
      setTimeout(() => {
          this.tabs.select('propertyAmenitiesList');
      });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        this.tabs.select(data.tabId);
    }

}
