import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-flight-fare-rule',
  templateUrl: './flight-fare-rule.component.html',
  styleUrls: ['./flight-fare-rule.component.scss']
})
export class FlightFareRuleComponent implements OnInit {
    @Input() showFareRule: boolean = false;
    @Input() fareRuleData: any[] = [];
    @Input() noData: boolean = false;
    @Input() moreFare = new EventEmitter<void>();
    @Output() hideModal = new EventEmitter<void>();
    @Output() hideMoreFare= new EventEmitter<void>();


    constructor(
    ) {
    }


  ngOnInit() {
  }

 

hide() {
    this.hideModal.emit();
  }

  hideModel(){
    this.hideMoreFare.emit()
  }

}
