import { Component, Inject, Input, OnInit ,ViewChild,ElementRef  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from 'projects/student/src/app/core/logger/logger.service';
import { HotelService } from '../../../../hotel.service';
const log = new Logger('FlightSearchComponent');

@Component({
    selector: 'app-hotel-search-loader',
    templateUrl: './hotel-search-loader.component.html',
    styleUrls: ['./hotel-search-loader.component.scss']
})
export class HotelSearchLoaderComponent implements OnInit {
 @ViewChild("progressBar", { static: false }) progressBar!: ElementRef;
    public arrow_right: string = "assets/images/right_arrow.png";
    airline_logo: string = '';
    hotelInfo: any
    percent = 0;
    constructor(
        private hotelService: HotelService,
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
        }, 100); // Update every 100ms for a smooth effect
      }

    ngOnInit() {
        this.hotelInfo = this.data.data
    }

    getCity(cityName) {
        let city = String(cityName).split(',')[0];
        return city;
    }
}
