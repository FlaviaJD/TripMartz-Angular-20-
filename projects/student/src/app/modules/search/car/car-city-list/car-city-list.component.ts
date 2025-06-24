import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-city-list',
  templateUrl: './car-city-list.component.html',
  styleUrls: ['./car-city-list.component.scss']
})
export class CarCityListComponent implements OnInit {

    @Input() getCities = [];
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
        this.getCities = changes.getCities.currentValue;
        const customAirports = [];
        this.getCities.map((val, i, arr) => {
            let pushedInSubAirport = false;
            for (let v of customAirports) {
                if (v.AirportCity === (val.SubPriority ?
                    val.AirportCity : '')
                ) {
                    if (!v['SubAirport'])
                        Object.assign(v, { SubAirport: [] })
                    v['SubAirport'].push(val);
                    pushedInSubAirport = true;
                    break;
                }
            }
            if (!pushedInSubAirport)
                customAirports.push(val)
        });
        this.getCities = customAirports;
    }

    get hasViewList(): boolean {
        try {
            if (this.getCities.length)
                return true;
            else
                return false;
        } catch (error) {
        }
    }

    onCitySelect(cityObj: object, inputFor: string): void {
        cityObj['inputFor'] = inputFor;
        this.whichCity.emit(cityObj);
        this.getCities.length = 0;
    }
}
