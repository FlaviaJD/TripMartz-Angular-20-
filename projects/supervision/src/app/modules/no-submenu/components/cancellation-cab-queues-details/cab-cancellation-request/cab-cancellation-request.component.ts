import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cab-cancellation-request',
  templateUrl: './cab-cancellation-request.component.html',
  styleUrls: ['./cab-cancellation-request.component.scss']
})
export class CabCancellationRequestComponent implements OnInit {

    voucherData: any;
    loading:boolean=false;
    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation && navigation.extras.state) {
            this.voucherData = navigation.extras.state.data;
            localStorage.setItem('data', JSON.stringify(this.voucherData));
        } else {
            // If data is not available in state, retrieve it from localStorage or localStorage
            const storedData = localStorage.getItem('data');
            if (storedData) {
                this.voucherData = JSON.parse(storedData);
            }
        }
    }
  
    ngOnInit() {
    }

}
