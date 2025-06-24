import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiHandlerService } from 'projects/employee/src/app/core/api-handlers';
import { SwalService } from 'projects/employee/src/app/core/services/swal.service';
import { SubSink } from 'subsink';
import { FlightService } from '../../../flight.service';

@Component({
  selector: 'app-flight-fare-rule',
  templateUrl: './flight-fare-rule.component.html',
  styleUrls: ['./flight-fare-rule.component.scss']
})
export class FlightFareRuleComponent implements OnInit {
    @Input() showFareRule: boolean = false;
    @Input() fareRuleData: any[] = [];
    @Input() noData: boolean = false;
    @Output() hideModal = new EventEmitter<void>();

    constructor(
    ) {
    }


  ngOnInit() {
  }

 

hide() {
    this.hideModal.emit();
  }

}
