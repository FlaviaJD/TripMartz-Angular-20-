import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';

@Component({
  selector: 'app-hotel-board-type-filter',
  templateUrl: './hotel-board-type-filter.component.html',
  styleUrls: ['./hotel-board-type-filter.component.scss']
})
export class HotelBoardTypeFilterComponent implements OnInit {

    regConfig: FormGroup;
    private subs = new SubSink();
    hotels = [];

    constructor(
        private fb: FormBuilder,
        private hotelService: HotelService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.subs.sink = this.hotelService.hotelsCopy.subscribe(data => {
            this.hotels = data;
            this.createForm(this.hotels);
        });
        this.subs.sink = this.hotelService.clearBoardType.subscribe(flag => {
            if(flag) {
                this.clearFilter();
            }
        });
    }

    createForm(hotels) {
        const boardTypeCheckboxes = this.hotelService.getUniqueBoardType(hotels); // Assuming you have a method to get unique locations
        const boardTypeFormArray = boardTypeCheckboxes.map((boardType) => this.addFields(boardType, boardType));
    
        this.regConfig = this.fb.group({
            boardType: new FormArray(boardTypeFormArray),
        });
    }
    

    addFields(name, value): FormGroup {
        return this.fb.group({
            isChecked: false,
            name,
            value
        })
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    getControls(control: string): FormArray {
        return this.regConfig.get(control) as FormArray;
    }

    filterByBoardType(isChecked: boolean, boardType: string) {
        // Update the state of the checkbox in the form
        const boardTypeFormArray = this.regConfig.get('boardType') as FormArray;
        const selectedBoardTypeFormArrayControl = boardTypeFormArray.controls.find(control =>
            control.get('name').value === boardType
        );

        if (selectedBoardTypeFormArrayControl) {
            selectedBoardTypeFormArrayControl.get('isChecked').setValue(isChecked);
        }

        // Build the list of selected locations
        const selectedBoardType = boardTypeFormArray.controls
            .filter(control => control.get('isChecked').value)
            .map(control => ({
                boardType: control.get('name').value,
                type: 'boardType',
                name: control.get('name').value,
                isChecked: control.get('isChecked').value,
            }));

        // Update the service with the selected locations
        this.hotelService.boardType.next(selectedBoardType);
        // Trigger the filtering process in the service
        this.hotelService.filterByBoardType();
    }


    clearFilter() {
       this.regConfig.reset(); // Reset the form group to its initial state
       this.hotelService.boardType.next([]);
       this.createForm(this.hotels); // Recreate the form with default values
       this.hotelService.filterByBoardType();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}

    

