import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bus-eligibility',
  templateUrl: './bus-eligibility.component.html',
  styleUrls: ['./bus-eligibility.component.scss']
})
export class BusEligibilityComponent implements OnInit {
 @Input("policyList") policyList;
 
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.policyList = changes.policyList.currentValue;
}

}
