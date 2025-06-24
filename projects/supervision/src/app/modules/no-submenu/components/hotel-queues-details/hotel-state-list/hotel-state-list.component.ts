import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-hotel-state-list',
    templateUrl: './hotel-state-list.component.html',
    styleUrls: ['./hotel-state-list.component.scss']
})
export class HotelStateListComponent implements OnInit {
    @Input() getCity = [];
    @Input() inputFor;
    @Output() whichCity = new EventEmitter();
    regConfig: FormGroup;

    constructor(
        private readonly formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.createForm();
    }

    createForm(): void {
        this.regConfig = this.formBuilder.group({
            checkArray: this.formBuilder.array([], [Validators.required]),
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.getCity = changes.getCity.currentValue;
        const customCity = [];
        this.getCity.map((val, i, arr) => {
            customCity.push(val)
        });
        this.getCity = customCity;
    }

    get hasViewList(): boolean {
        try {
            if (this.getCity.length)
                return true;
            else
                return false;
        } catch (error) {
        }
    }

    onCitySelect(cityObj: object, inputFor: string): void {
        cityObj['inputFor'] = inputFor;
        this.whichCity.emit(cityObj);
        this.getCity.length = 0;
    }

    onCheckBoxChange(e) {
        const checkArray: FormArray = this.regConfig.get('checkArray') as FormArray;
        if (e.target.checked) {
            checkArray.push(new FormControl(e.target.value));
        } else {
            let i = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value === e.target.value) {
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

}
