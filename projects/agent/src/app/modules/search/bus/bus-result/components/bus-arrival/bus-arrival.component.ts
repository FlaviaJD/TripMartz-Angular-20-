import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusService } from '../../../bus.service';

@Component({
  selector: 'app-bus-arrival',
  templateUrl: './bus-arrival.component.html',
  styleUrls: ['./bus-arrival.component.scss']
})
export class BusArrivalComponent implements OnInit {
  arrivalTimeForm: FormGroup;
  busCopy = [];
  initialValue: any = [];

  constructor(
    private fb: FormBuilder,
    private busService: BusService
  ) { }

  ngOnInit(): void {
    this.busService.arrivalInitialValue.subscribe(res => {
      this.initialValue = res;
      this.createArrivalTimeForm();
    });
    this.busService.busCopy.subscribe(res => {
      this.busCopy = res;
    });
  }

  createArrivalTimeForm() {
    this.arrivalTimeForm = this.fb.group(this.initialValue);
  }

  filterByArrivalTime(t, v) {
    this.arrivalTimeForm.controls[t].setValue(v ? 1 : 0);
    this.busService.arrivalEarlyMorning.next(this.arrivalTimeForm.get('arrivalEarlyMorning').value);
    this.busService.arrivalMidDay.next(this.arrivalTimeForm.get('arrivalMidDay').value);
    this.busService.arrivalEvening.next(this.arrivalTimeForm.get('arrivalEvening').value);
    this.busService.arrivalNight.next(this.arrivalTimeForm.get('arrivalNight').value);
    this.busService.filterByArrivalTime();
  }

  clearBusArrivalFilter() {
    this.busService.clearBusArrivalFilter();
  }

}
