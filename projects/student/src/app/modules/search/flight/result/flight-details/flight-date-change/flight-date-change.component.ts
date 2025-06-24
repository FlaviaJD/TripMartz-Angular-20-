import { Component, Input, OnInit } from '@angular/core';
import { FlightService } from '../../../flight.service';

@Component({
  selector: 'app-flight-date-change',
  templateUrl: './flight-date-change.component.html',
  styleUrls: ['./flight-date-change.component.scss']
})
export class FlightDateChangeComponent implements OnInit {
 @Input() flight: any;

  constructor(private flightService:FlightService) { }

    ngOnInit() {
        
    }

}
