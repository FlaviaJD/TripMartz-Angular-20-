import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-request-tabs',
  templateUrl: './booking-request-tabs.component.html',
  styleUrls: ['./booking-request-tabs.component.scss']
})
export class BookingRequestTabsComponent implements OnInit {

  selectedTab = 'flight';
  constructor(
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
      this.route.queryParams.subscribe(params => {
          if(params && params.sector){
              this.selectedTab=params.sector;
          }
      });
  }

}
