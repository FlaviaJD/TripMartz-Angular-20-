import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-retail-summary',
    templateUrl: './retail-summary.component.html',
    styleUrls: ['./retail-summary.component.scss']
})
export class RetailSummaryComponent implements OnInit {

    @Input('exchangePrice') exchangePrice;
    constructor() { }

    ngOnInit() {
    }

}
