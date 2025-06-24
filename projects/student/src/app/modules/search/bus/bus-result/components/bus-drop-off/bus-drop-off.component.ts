import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bus-drop-off',
  templateUrl: './bus-drop-off.component.html',
  styleUrls: ['./bus-drop-off.component.scss']
})
export class BusDropOffComponent implements OnInit {
  @Input('busDetails') busDetails: any;
  @Output() backToBusResult = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  hide() {
    this.backToBusResult.emit(true);
  }

}
