import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-car-eligibility',
  templateUrl: './car-eligibility.component.html',
  styleUrls: ['./car-eligibility.component.scss']
})
export class CarEligibilityComponent implements OnInit {
 @Input("policyList") policyList;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.policyList = changes.policyList.currentValue;
}

}
