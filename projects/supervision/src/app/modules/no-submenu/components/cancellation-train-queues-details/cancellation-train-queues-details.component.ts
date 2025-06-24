import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancellation-train-queues-details',
  templateUrl: './cancellation-train-queues-details.component.html',
  styleUrls: ['./cancellation-train-queues-details.component.scss']
})
export class CancellationTrainQueuesDetailsComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "train_queues";
    enableUpdate:boolean=false;
    trainUpdateData: any;

    
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
                this.activeIdString="add_update_hotel_queue";
            }
        })
    }
    
    showList(e){
        this.enableUpdate=false;
        this.activeIdString = "train_queues";
        this.tabs.select(this.activeIdString);
        this.cdr.detectChanges();
    }

    beforeChange(e) {
        this.enableUpdate=false;
    }

    triggerTab(data: any) {
        if (data) {
            this.enableUpdate=true;
            this.cdr.detectChanges();
            this.tabs.select(data.tabId);
            this.trainUpdateData = data.data;
        }
    }

}



