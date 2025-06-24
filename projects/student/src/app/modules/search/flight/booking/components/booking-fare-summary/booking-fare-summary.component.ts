import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-booking-fare-summary',
    templateUrl: './booking-fare-summary.component.html',
    styleUrls: ['./booking-fare-summary.component.scss']
})
export class BookingFareSummaryComponent implements OnInit, OnDestroy {

    @Input() flight: any;
    @Input() showTotalDisplayFare: any;
    isCollapsedGst = true;
    isCollapsedServiceReqs = true;
    name = 'SNF';
    adultCount = 0;
    childCount = 0;
    infantCount = 0;
    showDetails = true;
    baggageFee = 0.00;
    mealFee = 0.00;
    seatFee = 0.00;
    totalDisplayFare = 0.00;
    isBaggaeProtected: boolean = false;
    baggageProtectedData: any;
    protected subs = new SubSink();
    
    constructor(
        private flightService: FlightService,
        private cdRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.baggageFees.subscribe(res => {
            if (res && Object.keys(res).length > 0) {
                this.baggageFee = res['baggageFee'];
                this.totalDisplayFare = 0;
                if (this.flight) {
                    this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare) + Number(this.baggageFee) + Number(this.mealFee) + Number(this.seatFee);
                }
            }
            else {
                if (this.flight) {
                    this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare);
                }
            }
            this.cdRef.detectChanges();
        });
        this.subs.sink = this.flightService.mealFees.subscribe(res => {
            if (res && Object.keys(res).length > 0) {
                this.mealFee = res['mealFee'];
                this.totalDisplayFare = 0;
                if (this.flight) {
                    this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare) + Number(this.baggageFee) + Number(this.mealFee) + Number(this.seatFee);
                }
            }
            else {
                if (this.flight) {
                    this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare);
                }
            }
            this.cdRef.detectChanges();
        });
        this.subs.sink = this.flightService.seatFees.subscribe(res => {
            if (res && Object.keys(res).length > 0) {
                this.seatFee = res['seatFee'];
                this.totalDisplayFare = 0;
                if (this.flight) {
                    this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare) + Number(this.baggageFee) + Number(this.mealFee) + Number(this.seatFee);
                }
            }
            else {
                if (this.flight) {
                    this.totalDisplayFare = Number(this.flight.Price.TotalDisplayFare);
                }
            }
            this.cdRef.detectChanges();
        });
        this.cdRef.detectChanges();
    }

    isAdult(flight: any) {
        const result = flight ? flight['Price']['PassengerBreakup'].hasOwnProperty('ADT') : null;
        if (result) {
            this.adultCount = flight.Price.PassengerBreakup.ADT.PassengerCount;
        }
        return result;
    }

    isChild(flight: any) {
        const price = flight ? flight['Price']['PassengerBreakup'] : null;
        const result = price ?
            price.hasOwnProperty('CHD') || price.hasOwnProperty('CNN') || price.hasOwnProperty('C09') : false;
        if (result) {
            this.childCount = price.hasOwnProperty('CHD') ? price.CHD.PassengerCount : price.hasOwnProperty('CNN') ? price.CNN.PassengerCount : price.C09.PassengerCount
        }
        return result;
    }

    isInfant(flight: any) {
        const result = flight ? flight['Price']['PassengerBreakup'].hasOwnProperty('INF') : null;
        if (result) {
            this.infantCount = flight['Price']['PassengerBreakup'].INF.PassengerCount;
        }
        return result;
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    showFare() {
        this.name = this.name === 'SNF' ? 'HNF' : 'SNF';
        this.showDetails = this.name === 'HNF' ? false : true;
        this.cdRef.detectChanges();
    }

}
