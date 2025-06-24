import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-policyconfirmation',
    templateUrl: './policyconfirmation.component.html',
    styleUrls: ['./policyconfirmation.component.scss']
})
export class PolicyconfirmationComponent implements OnInit {
    showAprove: boolean;
    currentUser: any;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('studentCurrentUser')) || {};
        this.route.queryParams.subscribe(params => {
            if (params && params.status == 'Approve') {
                this.showAprove = true;
            }
            else {
                this.showAprove = false;
            }
        });
    }

}


