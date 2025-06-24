import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cancellation-cab-queues-details',
  templateUrl: './cancellation-cab-queues-details.component.html',
  styleUrls: ['./cancellation-cab-queues-details.component.scss']
})
export class CancellationCabQueuesDetailsComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
    activeIdString = "cab_queues";
    enableUpdate:boolean=false;
    cabUpdateData: any;
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
                this.activeIdString="add_update_cab_queue";
            }
        })
    }
    
    beforeChange(e) {
        this.enableUpdate=false;
    }

    showList(e){
        this.enableUpdate=false;
        this.activeIdString = "cab_queues";
        this.tabs.select(this.activeIdString);
        this.cdr.detectChanges();
    }

    triggerTab(data: any) {
        if (data) {
            this.enableUpdate=true;
            this.cdr.detectChanges();
            this.tabs.select(data.tabId);
            this.cabUpdateData = data.data;
        }
    }
}
