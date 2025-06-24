import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bus-pick-up',
  templateUrl: './bus-pick-up.component.html',
  styleUrls: ['./bus-pick-up.component.scss']
})
export class BusPickUpComponent implements OnInit {
  @Input('busDetails') busDetails: any;
  @Output() backToBusResult = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  hide() {
    this.backToBusResult.emit(true);
  }
}
