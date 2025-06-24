import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  @Input() getEmployee = [];
  @Input() inputFor;
  @Output() whichEmployee = new EventEmitter();
  regConfig: FormGroup;

  constructor(
      private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
      this.createForm();
  }

  createForm(): void {
      this.regConfig = this.formBuilder.group({
          checkArray: this.formBuilder.array([], [Validators.required]),
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.getEmployee= changes.getEmployee.currentValue;
      const customEmployeeList = [];
      this.getEmployee.map((val, i, arr) => {
        customEmployeeList.push(val)
      });
      this.getEmployee = customEmployeeList;
  }

  get hasViewList(): boolean {
      try {
          if (this.getEmployee.length)
              return true;
          else
              return false;
      } catch (error) {
      }
  }

  onEmployeeSelect(cityObj: object, inputFor: string): void {
      cityObj['inputFor'] = inputFor;
      this.whichEmployee.emit(cityObj);
      this.getEmployee.length = 0;
  }

}
