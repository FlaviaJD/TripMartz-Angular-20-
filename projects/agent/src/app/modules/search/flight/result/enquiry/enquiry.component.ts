import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {
  @Input() flight: any;
  @Output() selectedEnquiry= new EventEmitter<any>();
  @Input() selectedPrice:any;
  travelForm: FormGroup;
  beyond_limit_reason='';

  constructor(private fb: FormBuilder) { }

    ngOnInit() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const searchData = JSON.parse(localStorage.getItem('flightSearchData'));
        const name = `${user.first_name} ${user.last_name}`;
    }

    onSubmit() {
        let selectedPrice = localStorage.getItem('selectedPrice');
        const policies = [];
        const pricePolicy = {
            PolicyType: 'Pricing',
            Eligible: +selectedPrice,
            Selected: +this.selectedPrice.TotalDisplayFare,
            EligibilityCheck:'Beyond Price Eligibility',
            Remark: this.beyond_limit_reason // fixed from this.starRatingReason to this.priceReason
        };
        policies.push(pricePolicy);
        localStorage.setItem('flightPricePolicy', JSON.stringify(pricePolicy))
        this.selectedEnquiry.emit(this.flight);
    }

}
