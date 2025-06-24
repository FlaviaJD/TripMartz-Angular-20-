import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-hotel-approval-template',
  templateUrl: './hotel-approval-template.component.html',
  styleUrls: ['./hotel-approval-template.component.scss']
})
export class HotelApprovalTemplateComponent implements OnInit {

  data: any; // Assuming requestId is of type string, adjust the type accordingly
  mail_data:any;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
        this.data = navigation.extras.state.data;
        localStorage.setItem('data', JSON.stringify(this.data));
    } else {
        // If data is not available in state, retrieve it from localStorage or localStorage
        const storedData = localStorage.getItem('data');
        if (storedData) {
            this.data = JSON.parse(storedData);
        }
    }
}

  ngOnInit() {
    this.mail_data=JSON.parse(this.data.BookingDetails.mail_data);
  }

}
