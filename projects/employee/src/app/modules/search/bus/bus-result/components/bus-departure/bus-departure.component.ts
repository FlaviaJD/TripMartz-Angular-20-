import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusService } from '../../../bus.service';

@Component({
  selector: 'app-bus-departure',
  templateUrl: './bus-departure.component.html',
  styleUrls: ['./bus-departure.component.scss']
})
export class BusDepartureComponent implements OnInit {
  depTimForm: FormGroup;
  initialValue: any = [];
  busCopy = [];

  constructor(
    private fb: FormBuilder,
    private busService: BusService
  ) { }

  ngOnInit(): void {
    this.busService.departureInitialValue.subscribe(res => {
      this.initialValue = res;
      this.createDepartureTimeForm();
    });
    this.busService.busCopy.subscribe(res => {
      this.busCopy = res;
    });
  }

  createDepartureTimeForm() {
    this.depTimForm = this.fb.group(this.initialValue);
  }

  filterByDepartureTime(t, v) {
    this.depTimForm.controls[t].setValue(v ? 1 : 0);
    this.busService.earlyMorning.next(this.depTimForm.get('earlyMorning').value);
    this.busService.midDay.next(this.depTimForm.get('midDay').value);
    this.busService.evening.next(this.depTimForm.get('evening').value);
    this.busService.night.next(this.depTimForm.get('night').value);
    this.busService.filterByDepartureTime();
  }

  clearFilterByDepartureTime() {
    this.busService.clearFilterByDepartureTime();
  }

}
