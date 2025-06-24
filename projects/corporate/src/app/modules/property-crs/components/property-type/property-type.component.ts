import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-property-type',
  templateUrl: './property-type.component.html',
  styleUrls: ['./property-type.component.scss']
})
export class PropertyTypeComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
      setTimeout(() => {
          this.tabs.select('propertyTypeList');
      });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        this.tabs.select(data.tabId);
    }

}
