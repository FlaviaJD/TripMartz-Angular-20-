import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { HotelService } from '../../../../../hotel.service';

@Component({
  selector: 'app-priority-filter',
  templateUrl: './priority-filter.component.html',
  styleUrls: ['./priority-filter.component.scss']
})
export class PriorityFilterComponent implements OnInit {
    isActive: boolean = false; // Default status
  constructor(
    private hotelService: HotelService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.hotelService.clearStatus.subscribe(flag => {
        if (flag) {
            this.clearStatus();
        }
    });
   // this.hotelService.filterByStatus(this.isActive);
  }
  onStatusUpdate(event: MatSlideToggleChange) {
    this.isActive = event.checked;
    this.hotelService.filterByStatus(this.isActive);
}
clearStatus() {
    this.isActive = false; // Reset the toggle to inactive
    this.hotelService.filterByStatus(this.isActive);
}
}
