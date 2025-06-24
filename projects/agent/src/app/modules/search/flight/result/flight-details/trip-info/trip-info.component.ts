import { Component, Inject, OnInit ,ViewChild,ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from 'projects/agent/src/app/core/logger/logger.service';
import { FlightService } from '../../../flight.service';
const log = new Logger('FlightSearchComponent');


@Component({
    selector: 'app-trip-info',
    templateUrl: './trip-info.component.html',
    styleUrls: ['./trip-info.component.scss']
})
export class TripInfoComponent implements OnInit {
    @ViewChild("progressBar", { static: false }) progressBar!: ElementRef;
    public arrow_right: string = "assets/images/right_arrow.png";
    airline_logo: string = '';
    flightInfo: any;
    percent = 0;
    constructor(
        private flightService: FlightService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngAfterViewInit() {
        let progress = 0;
        let interval = setInterval(() => {
          progress += 5; // Increase progress in steps
          this.percent = progress;
          this.progressBar.nativeElement.style.width = `${this.percent}%`;
      
          if (progress >= 100) {
            clearInterval(interval); // Stop when it reaches 100%
          }
        }, 500); // Update every 100ms for a smooth effect
      }


    ngOnInit() {
        this.airline_logo = this.flightService.airline_logo;
        this.flightInfo = this.data.data
    }

    getCity (cityName) {
        let city = String(cityName).split(',')[0];
        return city;
    }


}
