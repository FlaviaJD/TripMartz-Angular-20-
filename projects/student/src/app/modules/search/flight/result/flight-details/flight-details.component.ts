import { Component, OnInit, Input } from '@angular/core';
import { FlightService } from '../../flight.service';
import { ActivatedRoute } from '@angular/router';
import { Logger } from '../../../../../core/logger/logger.service';

const log = new Logger('FlightDetailsComponent');

@Component({
    selector: 'app-flight-details',
    templateUrl: './flight-details.component.html',
    styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent implements OnInit {

    @Input() flight: any;
    tripType: any;
    isDomesticFlight=false;

    constructor(
        private flightService: FlightService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        this.isDomesticFlight = this.flightService.is_domestic;
        this.tripType = this.flightService.formFilled.tripType;
    }

    displaySeats(flight: any) {
        if (flight.FlightDetails.Details[0][0].Attr.hasOwnProperty('AvailableSeats')) {
            return flight.FlightDetails.Details[0][0].Attr.AvailableSeats;
        }
        return false;
    }

    stops(flight: any) {
        return flight.FlightDetails.Details[0].length - 1;
    }

}
