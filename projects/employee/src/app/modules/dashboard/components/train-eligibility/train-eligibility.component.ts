import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-train-eligibility',
  templateUrl: './train-eligibility.component.html',
  styleUrls: ['./train-eligibility.component.scss']
})
export class TrainEligibilityComponent implements OnInit {
    @Input("policyList") policyList;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.policyList = changes.policyList.currentValue;
}

}
