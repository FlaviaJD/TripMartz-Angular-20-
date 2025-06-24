import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FlightService } from '../../../flight.service';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-stops-filter',
    templateUrl: './stops-filter.component.html',
    styleUrls: ['./stops-filter.component.scss']
})
export class StopsFilterComponent implements OnInit {

    flights: any = [];
    flightsCopy: any = [];
    myValue: any;
    minPrice: any;
    maxPrice: any;
    stopsFrom: FormGroup;
    zeroStopActive = true;
    oneStopActive = true;
    multipleStopsActive = true;
    zeroStopPrice = 0;
    oneStopPrice = 0;
    multipleStopsPrice = 0;
    currentCurreny: string = '';
    protected subs = new SubSink();
    selectedStops: { [key: string]: boolean } = {
        zeroStop: false,
        oneStop: false,
        multipleStops: false
    };
    
    constructor(
        private fb: FormBuilder,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.subs.sink = this.flightService.currentCurrency.subscribe(res => {
            this.currentCurreny = res;
        });
        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            if (res.length){
                if (!this.flightService.isDomesticFlightSelected) {
                this.flightsCopy = res;
                this.currentCurreny = res[0]['Price']['Currency'];
                const tempZeroStopPrice = [];
                const tempOneStopPrice = [];
                const tempMultipleStopsPrice = [];
                res.forEach(flight => {
                    const tempFlight = flight.FlightDetails.Details[0];
                    if (tempFlight.length === 1) {
                        tempZeroStopPrice.push(flight.Price.TotalDisplayFare);
                    } else if (tempFlight.length === 2) {
                        tempOneStopPrice.push(flight.Price.TotalDisplayFare);
                    } else {
                        tempMultipleStopsPrice.push(flight.Price.TotalDisplayFare);
                    }
                });
                if (tempZeroStopPrice.length) {
                    this.zeroStopPrice = tempZeroStopPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                }
                if (tempOneStopPrice.length) {
                    this.oneStopPrice = tempOneStopPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                }
                if (tempMultipleStopsPrice.length) {
                    this.multipleStopsPrice = tempMultipleStopsPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                } else {
                    this.flightService.multipleStopsPrice.next(false);
                }
                }
                else {
                    this.setStopFilterTM(res);
                }
            } else {
                this.zeroStopPrice = 0;
                this.oneStopPrice = 0;
                this.multipleStopsPrice = 0;
            }
        });
        this.subs.sink = this.flightService.zeroStopActive.subscribe(res => {
            this.zeroStopActive = res;
        });
        this.subs.sink = this.flightService.oneStopActive.subscribe(res => {
            this.oneStopActive = res;
        });
        this.subs.sink = this.flightService.multipleStopsActive.subscribe(res => {
            this.multipleStopsActive = res;
        });
        this.flightService.stopsReset.subscribe(res => {
            if (res) {
                this.clearStopsFilter()
            }
        });
        this.createStopsFrom();
    }

    toggleStopSelection(stopType: string) {
        if ((stopType === 'zeroStop' && !this.zeroStopPrice) ||
            (stopType === 'oneStop' && !this.oneStopPrice) ||
            (stopType === 'multipleStops' && !this.multipleStopsPrice)) {
            return; // Prevent selection if disabled
        }
    
        this.selectedStops[stopType] = !this.selectedStops[stopType]; // Toggle selection
        this.filterByStops(stopType, this.selectedStops[stopType]); // Apply filter logic
    }

    setStopFilterTM(res){
        this.flightsCopy = res;
        if (res.length > 0 && res[0].length > 0) {
            const currency = res[0][0]['Price']['Currency'];
        }   
          const tempZeroStopPrice = [];
                const tempOneStopPrice = [];
                const tempMultipleStopsPrice = [];
                res.forEach(element => {
                    if (element) {
                        element.forEach(flight => {
                            const tempFlight = flight.FlightDetails.Details[0];
                            if (tempFlight.length === 1) {
                                tempZeroStopPrice.push(flight.Price.TotalDisplayFare);
                            } else if (tempFlight.length === 2) {
                                tempOneStopPrice.push(flight.Price.TotalDisplayFare);
                            } else {
                                tempMultipleStopsPrice.push(flight.Price.TotalDisplayFare);
                            }
                        });
                    }
                });
                if (tempZeroStopPrice.length) {
                    this.zeroStopPrice = tempZeroStopPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                }
                if (tempOneStopPrice.length) {
                    this.oneStopPrice = tempOneStopPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                }
                if (tempMultipleStopsPrice.length) {
                    this.multipleStopsPrice = tempMultipleStopsPrice.reduce((prev, curr) => {
                        return Number(prev) < curr ? prev : curr;
                    });
                } else {
                    this.flightService.multipleStopsPrice.next(false);
                }

    }

    createStopsFrom() {
        this.stopsFrom = this.fb.group({
            zeroStop: 0,
            oneStop: 0,
            multipleStops:0
        });
    }

    filterByStops(t, v) {
        this.stopsFrom.controls[t].setValue(v ? 1 : 0);
        this.flightService.zeroStopActive.next(
            (this.stopsFrom.get('zeroStop').value === 1 || this.stopsFrom.get('zeroStop').value === true) ? true : false
        );
        this.flightService.oneStopActive.next(
            (this.stopsFrom.get('oneStop').value === 1 || this.stopsFrom.get('oneStop').value === true) ? true : false
        );
        this.flightService.multipleStopsActive.next(
            (this.stopsFrom.get('multipleStops').value === 1 || this.stopsFrom.get('multipleStops').value === true) ? true : false
        );
        this.flightService.filterByStops();
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearStopsFilter() {
        this.stopsFrom.patchValue({
            zeroStop: 0,
            oneStop: 0,
            multipleStops: 0
        });
        this.selectedStops['zeroStop']=false;
        this.selectedStops['oneStop']=false;
        this.selectedStops['multipleStops']=false;
        this.flightService.zeroStopActive.next(false);
        this.flightService.oneStopActive.next(false);
        this.flightService.multipleStopsActive.next(false);
        this.flightService.filterByStops();
    }

}
