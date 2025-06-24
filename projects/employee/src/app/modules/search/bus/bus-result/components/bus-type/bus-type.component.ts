import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BusService } from '../../../bus.service';

@Component({
  selector: 'app-bus-type',
  templateUrl: './bus-type.component.html',
  styleUrls: ['./bus-type.component.scss']
})
export class BusTypeComponent implements OnInit {
  bus: any = [];
  formControls;
  busTypeForm: FormGroup;
  filteredArray: any = [];

  constructor(
    private busService: BusService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.busService.busCopy.subscribe(res => {
      if (res && res.length) {
        this.bus = res;
        this.removeDublicateValues(this.bus)
        this.formControls = this.filteredArray.map(control => new FormControl(false));
        this.createForm();
      }
    });
  }

  removeDublicateValues(bus) {
    const uniqueOperators = bus.filter((bus, index, self) =>
      index === self.findIndex(p => p.busType === bus.busType)
    );
    this.filteredArray = uniqueOperators;
  }

  createForm() {
    this.busTypeForm = this.fb.group({
      bus: new FormArray(this.formControls)
    });
  }

  filterByBusOperators(val) {
    const filteredBusType = [];
    this.busTypeForm.value.bus.forEach((element, i) => {
      filteredBusType.push({ name: this.filteredArray[i].busType, isChecked: element });
    });
    this.busService.busType.next(filteredBusType);
    this.busService.filterBusOperators();
  }

  clearFilterByBusType() {
    this.busService.clearFilterByBusType();
  }
}
