import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.scss']
})
export class ManageDepartmentComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    hotelData: any;
  
    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
        setTimeout(() => {
            this.tabs.select('departmentList');
        });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        if (data)
        this.tabs.select(data.tabId);
    }


}
