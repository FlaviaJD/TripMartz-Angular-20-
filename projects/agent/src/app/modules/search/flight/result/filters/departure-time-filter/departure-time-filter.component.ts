import { Component, OnInit } from '@angular/core';
import { FlightService } from '../../../flight.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
    selector: 'app-departure-time-filter',
    templateUrl: './departure-time-filter.component.html',
    styleUrls: ['./departure-time-filter.component.scss']
})
export class DepartureTimeFilterComponent implements OnInit {

    originCityName: any;
    flightsCopy = [];
    depTimForm: FormGroup;
    initialValue = {
        earlyMorning: 0,
        morning: 0,
        midDay: 0,
        evening: 0
    };
    enabled = false;
    protected subs = new SubSink();
    selectedTimes: { [key: string]: boolean } = {
        earlyMorning: false,
        morning: false,
        midDay: false,
        evening: false
    };
    
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private flightService: FlightService
    ) { }

    ngOnInit() {
        this.createDepartureTimeForm();
        if (this.flightService.formFilled) {
            if (this.flightService.formFilled == 'Multi-city') {
                this.originCityName = (this.flightService.formFilled.cities[0].departureCity.split('('))[0];
            } else {
                this.originCityName = (this.flightService.formFilled.departureCity.split('('))[0];
            }
        }
        this.subs.sink = this.flightService.flights.subscribe(res => {
            this.enabled = res.length;
        });

        this.subs.sink = this.flightService.flightsCopy.subscribe(res => {
            this.flightsCopy = res;
        });
        this.subs.sink = this.flightService.departureReset.subscribe(res => { 
            if (res) {
                this.clearDepartureTimeFilter();
            }
        });
    }

    toggleSelection(timePeriod: string) {
        this.selectedTimes[timePeriod] = !this.selectedTimes[timePeriod]; // Toggle state
        this.filterByDepartureTime(timePeriod, this.selectedTimes[timePeriod]); // Trigger filter logic
    }

    createDepartureTimeForm() {
        this.depTimForm = this.fb.group(this.initialValue);
    }

    filterByDepartureTime(t, v) {
        this.depTimForm.controls[t].setValue(v ? 1 : 0);
        this.flightService.earlyMorning.next(
            this.depTimForm.get('earlyMorning').value === 1 ? true : false
        );
        this.flightService.morning.next(
            this.depTimForm.get('morning').value === 1 ? true : false
        );
        this.flightService.midDay.next(
            this.depTimForm.get('midDay').value === 1 ? true : false
        );
        this.flightService.evening.next(
            this.depTimForm.get('evening').value === 1 ? true : false
        );
        this.flightService.filterByDepartureTime();

    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    clearDepartureTimeFilter() {
        this.depTimForm.patchValue({
            earlyMorning: 0,
            morning: 0,
            midDay: 0,
            evening: 0
        });
        this.selectedTimes['earlyMorning']=false;
        this.selectedTimes['morning']=false;
        this.selectedTimes['midDay']=false;
        this.selectedTimes['evening']=false;
        this.flightService.earlyMorning.next(false);
        this.flightService.morning.next(false);
        this.flightService.midDay.next(false);
        this.flightService.evening.next(false);
        this.flightService.filterByDepartureTime();
    }
}
