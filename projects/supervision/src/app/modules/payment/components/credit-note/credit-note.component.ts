import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-credit-note',
    templateUrl: './credit-note.component.html',
    styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit {

    navLinks = [
        {
            label: 'Cancelled amount | Refunded Amount | View Credit Note',
            icon: 'fa fa-edit',
            component: 'cancelRefundView',
        }
    ]

    constructor() { }

    ngOnInit() {
    }

    onSelect(){
        
    }

}
