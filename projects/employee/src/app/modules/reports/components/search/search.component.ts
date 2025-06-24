import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeOptions } from 'projects/employee/src/app/theme-options';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Input() searchtype;
    @Output() searchValuesEvent = new EventEmitter<string>();
    activeIdString: any = "left";
    module: string;
    hideOther:boolean=false;
    public flightIcon: string = "assets/images/login-images/assets/flight.png";
    public hotelIcon: string = "assets/images/login-images/assets/material-hotel.png";
    public insuranceIcon: string = "assets/images/login-images/assets/document.png";

    constructor(
        private router: Router,
        private globals: ThemeOptions
    ) {
    }

    ngOnInit() {
        this.hideOther = this.globals.hideOther;
        if (this.searchtype == 'flight') {
            this.module = 'flight';
            this.activeIdString = "flight"
        } else if (this.searchtype == 'hotel') {
            this.module = 'hotel';
            this.activeIdString = "hotel"
        } else if (this.searchtype == 'train') {
            this.module = 'train';
            this.activeIdString = "train"
        }
        else if (this.searchtype == 'car') {
            this.module = 'car';
            this.activeIdString = "car"
        }
        // this.onSearchTypeChange(this.searchType);
    }

    receiveSearchForm($event) {
        this.searchValuesEvent.emit($event);
    }

    onSearchTypeChange(value) {
        this.searchtype = value;
        this.router.navigate(["reports/" + value + "-booking-details"])
    }

}
