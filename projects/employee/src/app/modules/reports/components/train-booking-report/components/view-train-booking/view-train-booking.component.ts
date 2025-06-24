import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-view-train-booking',
  templateUrl: './view-train-booking.component.html',
  styleUrls: ['./view-train-booking.component.scss']
})
export class ViewTrainBookingComponent implements OnInit {
    data: any; // Assuming data is of type any
    paxDetails:any;

    constructor(public activeModal: NgbActiveModal,
) { }

  ngOnInit() {
    this.paxDetails=this.data.PaxDetails;
  }

}
