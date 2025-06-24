import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-booking-approval-tabs',
    templateUrl: './booking-approval-tabs.component.html',
    styleUrls: ['./booking-approval-tabs.component.scss']
})
export class BookingApprovalTabsComponent implements OnInit {

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
