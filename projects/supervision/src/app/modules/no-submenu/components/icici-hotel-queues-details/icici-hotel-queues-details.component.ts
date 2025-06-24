import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icici-hotel-queues-details',
  templateUrl: './icici-hotel-queues-details.component.html',
  styleUrls: ['./icici-hotel-queues-details.component.scss']
})
export class IciciHotelQueuesDetailsComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "icici_hotel_queues";
    enableUpdate:boolean=false;
    iciciUpdateData: any;
    
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
                this.activeIdString="add_update_icici_hotel_queue";
            }
        })
    }
    
    beforeChange(e) {
        this.enableUpdate=false;
    }

    showList(e){
        this.enableUpdate=false;
        this.activeIdString = "icici_hotel_queues";
        this.tabs.select(this.activeIdString);
        this.cdr.detectChanges();
    }
    
    triggerTab(data: any) {
        if (data) {
            this.enableUpdate=true;
            this.cdr.detectChanges();
            this.tabs.select(data.tabId);
            this.iciciUpdateData = data.data;
        }
    }

}
