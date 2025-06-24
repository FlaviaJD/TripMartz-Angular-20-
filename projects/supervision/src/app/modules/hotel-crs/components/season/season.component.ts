import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from 'projects/supervision/src/app/core/logger/logger.service';
const log = new Logger('hotel-crs/HotelAmenitiesComponent')
@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss']
})
export class SeasonComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    seasonData: any;
  
    constructor() { }
  
    ngOnInit(): void {
    }
  
    beforeChange(e) {
      log.debug('tabChanged', e)
    }
  
    triggerTab(data: any) {
      if (data.seasonData)
        this.seasonData = data.seasonData;
      this.tabs.select(data.tabId);
    }
   // this.tabs.select(data.tabId);
}

