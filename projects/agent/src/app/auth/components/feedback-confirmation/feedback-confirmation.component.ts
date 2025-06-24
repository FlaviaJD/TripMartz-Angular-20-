import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback-confirmation',
  templateUrl: './feedback-confirmation.component.html',
  styleUrls: ['./feedback-confirmation.component.scss']
})
export class FeedbackConfirmationComponent implements OnInit {
  showAprove: boolean;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        if(params && params.status){
         this.showAprove=true;
        }
        else{
         this.showAprove=false;
        }
     });
  }

}
