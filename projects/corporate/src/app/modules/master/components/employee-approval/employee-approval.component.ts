import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap/tabset/tabset';

@Component({
  selector: 'app-employee-approval',
  templateUrl: './employee-approval.component.html',
  styleUrls: ['./employee-approval.component.scss']
})
export class EmployeeApprovalComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    hotelData: any;
    constructor() { }
    ngOnInit(): void {
    }
  
    ngAfterViewInit(){
        setTimeout(() => {
            this.tabs.select('employeeApprovalList');
        });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        if (data)
        this.tabs.select(data.tabId);
    }
}
