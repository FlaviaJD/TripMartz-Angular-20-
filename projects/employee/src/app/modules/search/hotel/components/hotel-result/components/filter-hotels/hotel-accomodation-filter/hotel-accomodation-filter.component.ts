import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { SubSink } from 'subsink';
import { HotelService } from '../../../../../hotel.service';

@Component({
    selector: 'app-hotel-accomodation-filter',
    templateUrl: './hotel-accomodation-filter.component.html',
    styleUrls: ['./hotel-accomodation-filter.component.scss']
})
export class HotelAccomodationFilterComponent implements OnInit {
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
        this.subs.sink = this.hotelService.clearLocation.subscribe(flag => {
            if(flag) {
                this.clearFilter();
            }
        });
    }

    createForm(hotels) {
        const locationCheckboxes = this.hotelService.getUniqueLocation(hotels); // Assuming you have a method to get unique locations
        const locationFormArray = locationCheckboxes.map((location) => this.addFields(location, location));
    
        this.regConfig = this.fb.group({
            locations: new FormArray(locationFormArray),
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

    filterByLocation(isChecked: boolean, amenityName: string) {
        // Update the state of the checkbox in the form
        const locationFormArray = this.regConfig.get('locations') as FormArray;
        const selectedLocatiomControl = locationFormArray.controls.find(control =>
            control.get('name').value === amenityName
        );

        if (selectedLocatiomControl) {
            selectedLocatiomControl.get('isChecked').setValue(isChecked);
        }

        // Build the list of selected locations
        const selectedAmenities = locationFormArray.controls
            .filter(control => control.get('isChecked').value)
            .map(control => ({
                location: control.get('name').value,
                type: 'locations',
                name: control.get('name').value,
                isChecked: control.get('isChecked').value,
            }));

        // Update the service with the selected locations
        this.hotelService.location.next(selectedAmenities);

        // Trigger the filtering process in the service
        this.hotelService.filterByLocation();
    }


    clearFilter() {
       this.regConfig.reset(); // Reset the form group to its initial state
       this.hotelService.location.next([]);
       this.createForm(this.hotels); // Recreate the form with default values
       this.hotelService.filterByLocation();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}

    

