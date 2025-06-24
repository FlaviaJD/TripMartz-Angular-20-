import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-make-payment',
    templateUrl: './make-payment.component.html',
    styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {
    @ViewChild('tabs',{ static: true }) tabset: NgbTabset;
    activeIdString = 'History_Deposit_Request';
    navLinks = [
        {
            label: 'HISTORY DEPOSIT REQUEST',
            icon: '',
            component: 'History_Deposit_Request',
        },
        {
            label: 'DEPOSIT REQUEST',
            icon: '',
            component: 'Deposit_Request'
        },
    ]
    hideHeader: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    activateChildTab(tab) {
        this.activeIdString = tab;
        this.tabset.select(tab);
    }

    onSelect(e) {

    }

}
