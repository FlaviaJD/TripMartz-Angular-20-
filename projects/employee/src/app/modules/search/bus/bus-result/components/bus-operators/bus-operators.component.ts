import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BusService } from '../../../bus.service';

@Component({
  selector: 'app-bus-operators',
  templateUrl: './bus-operators.component.html',
  styleUrls: ['./bus-operators.component.scss']
})
export class BusOperatorsComponent implements OnInit {

  bus: any = [];
  filteredArray: any = [];
  formControls;
  busForm: FormGroup;
  
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
      index === self.findIndex(p => p.travels === bus.travels)
    );
    this.filteredArray = uniqueOperators;
  }

  createForm() {
    this.busForm = this.fb.group({
      bus: new FormArray(this.formControls)
    });
  }

  filterByBusOperators(val) {
    const filteredBus = [];
    this.busForm.value.bus.forEach((element, i) => {
      filteredBus.push({ name: this.filteredArray[i].travels, isChecked: element });
    });
    this.busService.busOperators.next(filteredBus);
    this.busService.filterBusOperators();
  }

  clearFilterByBusOperators() {
    this.busService.clearFilterByBusOperators();
  }

}
