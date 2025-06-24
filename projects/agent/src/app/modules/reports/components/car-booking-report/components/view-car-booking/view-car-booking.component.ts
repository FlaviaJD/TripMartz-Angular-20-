import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-view-car-booking',
    templateUrl: './view-car-booking.component.html',
    styleUrls: ['./view-car-booking.component.scss']
})
export class ViewCarBookingComponent implements OnInit {
    data: any; // Assuming data is of type any
    details: any;
    
    constructor(public activeModal: NgbActiveModal,
        ) { }


    ngOnInit() {
        this.details = this.data;
    }
    getFormtedStatus(status: string) {
        let tmpStatus = status.split('_');
        return `${tmpStatus[0] + ' ' + tmpStatus[1]}`
    }

}
