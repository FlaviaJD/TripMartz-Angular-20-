import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ApiHandlerService } from '../../../../../../core/api-handlers';
import { SubSink } from 'subsink';
import { SwalService } from '../../../../../../core/services/swal.service';
import { FlightService } from '../../../flight.service';
@Component({
    selector: 'app-flight-details-fare',
    templateUrl: './flight-details-fare.component.html',
    styleUrls: ['./flight-details-fare.component.scss']
})
export class FlightDetailsFareComponent implements OnInit, OnDestroy {

    @Input() flight: any;
    isCollapsed: boolean = true;
    fareRuleData = [];
    noData: boolean = false;
    childProp: any = '';
    isDomesticFlightSelected:boolean=false;

    protected subs = new SubSink();

    constructor(
        private apiHandlerService: ApiHandlerService,
        private swalService: SwalService,
        private flightService:FlightService
    ) { }

    ngOnInit() {
        this.isDomesticFlightSelected=this.flightService.is_domestic;
    }

    isAdult(flight: any) {
        return flight.Price.PassengerBreakup.hasOwnProperty('ADT');
    }

    isChild(flight: any) {
        if (flight.Price.PassengerBreakup.hasOwnProperty('CHD'))
            this.childProp = 'CHD';
        else if (flight.Price.PassengerBreakup.hasOwnProperty('CNN'))
            this.childProp = 'CNN';
        else if (flight.Price.PassengerBreakup.hasOwnProperty('C09'))
            this.childProp = 'CNN';
        return flight.Price.PassengerBreakup.hasOwnProperty('CHD') || flight.Price.PassengerBreakup.hasOwnProperty('CNN') || flight.Price.PassengerBreakup.hasOwnProperty('C09');
    }

    isInfant(flight: any) {
        return flight.Price.PassengerBreakup.hasOwnProperty('INF');
    }

    getFareRule(flight) {
        this.fareRuleData=[];
        let fareRuleData = {
            ResultToken: flight.searchResultToken ? flight.searchResultToken : flight.ResultToken,
            booking_source: flight.booking_source
        }
        this.subs.sink = this.apiHandlerService.apiHandler('fareRule', 'POST', '', '', fareRuleData).subscribe(res => {
            if (res.Status) {
                if (res.data.length) {
                    this.noData = false;
                    this.fareRuleData = res.data;
                } else {
                    this.noData = true;
                    this.fareRuleData=[];
                }
            }
        }, err => {
            this.noData = true;
            this.fareRuleData=[];
            this.swalService.alert.oops(err.error.Message);
        });
        this.isCollapsed = !this.isCollapsed;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
