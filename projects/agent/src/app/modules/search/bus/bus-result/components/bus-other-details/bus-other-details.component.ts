import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bus-other-details',
  templateUrl: './bus-other-details.component.html',
  styleUrls: ['./bus-other-details.component.scss']
})
export class BusOtherDetailsComponent implements OnInit {
  @Input('busDetails') busDetails: any;
  @Output() backToBusResult = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  
  hide() {
    this.backToBusResult.emit(true);
  }

}
