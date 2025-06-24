import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { SwalService } from 'projects/supervision/src/app/core/services/swal.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-dcb-hotel-details',
  templateUrl: './dcb-hotel-details.component.html',
  styleUrls: ['./dcb-hotel-details.component.scss']
})
export class DcbHotelDetailsComponent implements OnInit {
    voucherData:any;
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
      this.mail_data=JSON.parse(this.data.mail_data);
    }
}
