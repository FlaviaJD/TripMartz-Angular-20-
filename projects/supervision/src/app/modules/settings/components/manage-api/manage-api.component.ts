import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Logger } from '../../../../core/logger/logger.service';

const log = new Logger('manage-api/ManageApiComponent')

@Component({
    selector: 'app-manage-api',
    templateUrl: './manage-api.component.html',
    styleUrls: ['./manage-api.component.scss']
})
export class ManageApiComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    hotelData: any;

    constructor() { }

    ngOnInit(): void {
    }

    beforeChange(e) {
        log.debug('tabChanged', e)
    }

    triggerTab(data: any) {
        if (data.hotel)
            this.hotelData = data.hotel;
        this.tabs.select(data.tabId);
    }

}
