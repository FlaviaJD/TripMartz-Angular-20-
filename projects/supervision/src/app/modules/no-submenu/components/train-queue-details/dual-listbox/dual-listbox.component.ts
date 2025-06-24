import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-dual-listbox',
    templateUrl: './dual-listbox.component.html',
    styleUrls: ['./dual-listbox.component.scss']
})
export class DualListboxComponent implements OnInit {
    @Input() availablePassengers: any[] = [];
    @Input() selectedPassenger: any[] = [];
    @Output() selectionChange = new EventEmitter<any[]>();
    availableFilter = '';
    selectedFilter = '';

    constructor() { }

    get filteredAvailableItems(): any[] {
        return this.availablePassengers.filter(item =>
            this.passengerMatchesFilter(item, this.availableFilter)
        );
    }

    passengerMatchesFilter(passenger: any, filter: string): boolean {
        // Replace 'FirstName' with the actual property you want to filter
        return (
            passenger.FirstName &&
            passenger.FirstName.toLowerCase().includes(filter.toLowerCase())
        );
    }

    get filteredSelectedItems(): any[] {
        return this.selectedPassenger.filter(item =>
            this.passengerMatchesFilter(item, this.selectedFilter)
        );
    }

    moveItemToSelected(item: any) {
        const index = this.availablePassengers.indexOf(item);
        if (index !== -1) {
            this.availablePassengers.splice(index, 1);
            this.selectedPassenger.push(item);
            this.selectionChange.emit([...this.selectedPassenger]); // Emit the updated list
        }
    }

    moveItemToAvailable(item: any) {
        const index = this.selectedPassenger.indexOf(item);
        if (index !== -1) {
            this.selectedPassenger.splice(index, 1);
            this.availablePassengers.push(item);
            this.selectionChange.emit([...this.selectedPassenger]); // Emit the updated list
        }
    }

    ngOnInit() { }
}

