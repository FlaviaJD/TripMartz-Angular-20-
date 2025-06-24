import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-policy-confirmation',
  templateUrl: './policy-confirmation.component.html',
  styleUrls: ['./policy-confirmation.component.scss']
})
export class PolicyConfirmationComponent implements OnInit {
  showAprove: boolean;
  loggedInUser: any;
                                                                        
  constructor(
    private route: ActivatedRoute
  ) { 
    this.loggedInUser = JSON.parse(localStorage.getItem("currentUser"));

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
       if(params && params.status=='Approve'){
        this.showAprove=true;
       }
       else{
        this.showAprove=false;
       }
    });
  }

}
