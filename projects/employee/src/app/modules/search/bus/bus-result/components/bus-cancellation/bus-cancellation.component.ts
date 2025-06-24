import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bus-cancellation',
  templateUrl: './bus-cancellation.component.html',
  styleUrls: ['./bus-cancellation.component.scss']
})
export class BusCancellationComponent implements OnInit {

  @Input('cancelPolicy') cancelPolicy: any;
  @Output() backToBusResult = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {

  }

  hide() {
    this.backToBusResult.emit(true);
  }


}
