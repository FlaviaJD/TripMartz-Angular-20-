import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancellation-hotel-queues-details',
  templateUrl: './cancellation-hotel-queues-details.component.html',
  styleUrls: ['./cancellation-hotel-queues-details.component.scss']
})
export class CancellationHotelQueuesDetailsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "cancellation_hotel_queues";
    enableUpdate:boolean=false;
    updateData: any;
    
    constructor(
        private route: ActivatedRoute,
        private cdr:ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.setSelectedTab();
    }

    setSelectedTab(){
        this.route.queryParams.subscribe(params => {
            if(params && params.tabId){
                this.activeIdString="add_update_cancellation_hotel_queue";
            }
        })
    }
    
    beforeChange(e) {
        this.enableUpdate=false;
    }

    showList(e){
        this.enableUpdate=false;
        this.activeIdString = "cancellation_hotel_queues";
        this.tabs.select(this.activeIdString);
        this.cdr.detectChanges();
    }
    
    triggerTab(data: any) {
        if (data) {
            this.enableUpdate=true;
            this.cdr.detectChanges();
            this.tabs.select(data.tabId);
            this.updateData = data.data;
        }
    }

}

