import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-hotel-eligibility',
  templateUrl: './hotel-eligibility.component.html',
  styleUrls: ['./hotel-eligibility.component.scss']
})
export class HotelEligibilityComponent implements OnInit {

  @Input("policyList") policyList;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.policyList = changes.policyList.currentValue;
}

}
