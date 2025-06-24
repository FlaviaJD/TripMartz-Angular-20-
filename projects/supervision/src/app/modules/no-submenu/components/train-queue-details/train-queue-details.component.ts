import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-train-queue-details',
  templateUrl: './train-queue-details.component.html',
  styleUrls: ['./train-queue-details.component.scss']
})
export class TrainQueueDetailsComponent implements OnInit {
 
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "train_queues";
    enableUpdate:boolean=false;
    trainUpdateData: any;
    queueType:any;
    constructor(
        private route: ActivatedRoute,
        private cdr:ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.setSelectedTab();
    }

    setSelectedTab(){
        this.route.queryParams.subscribe(params => {
            if(params){
                this.activeIdString = params.tabId ? "add_update_hotel_queue" : this.activeIdString;
                this.queueType = params.type || this.queueType;
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
