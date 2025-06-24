import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-employee',
  templateUrl: './manage-employee.component.html',
  styleUrls: ['./manage-employee.component.scss']
})
export class ManageEmployeeComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    hotelData: any;
  
    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
        setTimeout(() => {
            this.tabs.select('employeeList');
        });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        if (data)
        this.tabs.select(data.tabId);
    }



}
