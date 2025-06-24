import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-board-type',
  templateUrl: './board-type.component.html',
  styleUrls: ['./board-type.component.scss']
})
export class BoardTypeComponent implements OnInit {

    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

    constructor() { }
  
    ngOnInit(): void {
      
    }
  
    ngAfterViewInit(){
      setTimeout(() => {
          this.tabs.select('boardTypeList');
      });
    }
  
    beforeChange(e) {
    }
  
    triggerTab(data: any) {
        this.tabs.select(data.tabId);
    }

}
