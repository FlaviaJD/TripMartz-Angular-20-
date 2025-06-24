import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-flight-eligibility',
  templateUrl: './flight-eligibility.component.html',
  styleUrls: ['./flight-eligibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlightEligibilityComponent implements OnInit {

  @Input("policyList") policyList;

  constructor() { }

  ngOnInit() {
  }

  getShortSector(flight_short_sector){
    if(flight_short_sector){
        return JSON.parse(flight_short_sector);
    }
    else{
        return '';
    }
}

ngOnChanges(changes: SimpleChanges): void {
    this.policyList = changes.policyList.currentValue;
}

}
