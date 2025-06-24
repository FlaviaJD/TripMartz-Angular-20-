import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-update-credit-limit',
    templateUrl: './update-credit-limit.component.html',
    styleUrls: ['./update-credit-limit.component.scss']
})
export class UpdateCreditLimitComponent implements OnInit {
    @ViewChild('tabs', { static: true }) tabset: NgbTabset;
    activeIdString = 'updateCreditLimit';


    constructor(
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
    }

    setActiveTab(event) {
        this.activeIdString = event;
        this.tabset.select(event);
    }

    onSelect(value) {
        this.activeIdString = value;
        this.cdRef.detectChanges();
    }


}
