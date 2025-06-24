import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-purpose',
  templateUrl: './manage-purpose.component.html',
  styleUrls: ['./manage-purpose.component.scss']
})
export class ManagePurposeComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    hotelData: any;
  
    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
        setTimeout(() => {
            this.tabs.select('purposeList');
        });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        if (data)
        this.tabs.select(data.tabId);
    }


}
