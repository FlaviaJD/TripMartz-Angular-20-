import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-commission',
    templateUrl: './commission.component.html',
    styleUrls: ['./commission.component.scss']

})
export class CommissionComponent implements OnInit {

    navLinks = [
        {
          label: 'Flight',
          icon: 'fa fa-plane',
          component: 'flight'
        },
      ]
    
      constructor() { }
    
      ngOnInit() {
      }
      onSelect() {
    
      }
}