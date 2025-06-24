import { Component, OnInit } from '@angular/core';
import { BusService } from '../../../bus.service';

@Component({
  selector: 'app-bus-sorting',
  templateUrl: './bus-sorting.component.html',
  styleUrls: ['./bus-sorting.component.scss']
})
export class BusSortingComponent implements OnInit {
  availableSort = [];
  active = 'byPrice';
  byOperation = true;
  byDepart = true;
  byDuration = true;
  byArrival = true;
  byPrice = true;

  constructor(
    private busService: BusService
  ) { }

  ngOnInit(): void {
    this.busService.applySortingAfterFilter.subscribe(res => {
      if (res) {
        switch (this.active) {
          case 'byOperation':
            this.sortByOperation(true);
            break;
          case 'byDepart':
            this.sortByDepart(true);
            break;
          case 'byDuration':
            this.sortByDuration(true);
            break;
          case 'byArrival':
            this.sortByArrive(true);
            break;
          case 'byPrice':
            this.sortByPrice(true);
            break;
          default:
            break;
        }
      }
    });
  }

  sortByOperation(internalCall: boolean = false) {
    this.active = 'byOperation';
    this.byOperation = internalCall ? this.byOperation : !this.byOperation;
    const tempBus = [...this.busService.bus.value]; // use spread operator instead of JSON parse/stringify
    const sortedBus = tempBus.sort((a, b) => {
      const resultA = a.travels;
      const resultB = b.travels;
      return this.byOperation ? resultB.localeCompare(resultA) : resultA.localeCompare(resultB);
    });
    this.busService.bus.next(sortedBus);
  }

  sortByDepart(internalCall: boolean = false) {
    this.active = 'byDepart';
    this.byDepart = internalCall ? this.byDepart : !this.byDepart;
    
    const tempBus = [...this.busService.bus.value]; // use spread operator instead of JSON parse/stringify
    
    const sortedBus = tempBus.sort((a, b) => {
        const [hoursA, minutesA] = a.departureTime.split(':').map(Number);
        const [hoursB, minutesB] = b.departureTime.split(':').map(Number);

        const resultA = new Date(1970, 0, 1, hoursA, minutesA).getTime();
        const resultB = new Date(1970, 0, 1, hoursB, minutesB).getTime();
        
        return this.byDepart ? resultA - resultB : resultB - resultA;
    });

    this.busService.bus.next(sortedBus);
}


  sortByDuration(internalCall: boolean = false) {
    this.active = 'byDuration';
    this.byDuration = internalCall ? this.byDuration : !this.byDuration;
    const bus = [...this.busService.bus.value]; // use spread operator instead of JSON parse/stringify
    const sortedBus = bus.sort((a, b) => {
        const [hoursA, minutesA] = a.duration.replace(' hrs', '').split(':').map(Number);
        const [hoursB, minutesB] = b.duration.replace(' hrs', '').split(':').map(Number);
        const resultA = new Date(1970, 0, 1, hoursA, minutesA).getTime();
        const resultB = new Date(1970, 0, 1, hoursB, minutesB).getTime();
        return this.byDuration ? resultA - resultB : resultB - resultA;
    });
    this.busService.bus.next(sortedBus);
  }

  sortByArrive(internalCall: boolean = false) {
    this.active = 'byArrive';

    this.byDepart = internalCall ? this.byDepart : !this.byDepart;
    
    const tempBus = [...this.busService.bus.value]; // use spread operator instead of JSON parse/stringify
    
    const sortedBus = tempBus.sort((a, b) => {
        const [hoursA, minutesA] = a.arrivalTime.split(':').map(Number);
        const [hoursB, minutesB] = b.arrivalTime.split(':').map(Number);

        const resultA = new Date(1970, 0, 1, hoursA, minutesA).getTime();
        const resultB = new Date(1970, 0, 1, hoursB, minutesB).getTime();
        
        return this.byDepart ? resultA - resultB : resultB - resultA;
    });

    this.busService.bus.next(sortedBus);
}

  sortByPrice(internalCall: boolean = false) {
    this.active = 'byPrice';
    this.byPrice = internalCall ? this.byPrice : !this.byPrice;
    const bus = this.busService.bus.value;
    const sortedBus = bus.sort((a, b) => {
      const resultA = Number(a['totalFares'] || 0);
      const resultB = Number(b['totalFares'] || 0);
      return this.byPrice ? resultB - resultA : resultA - resultB;
    });
    this.busService.bus.next(sortedBus);
  }

}
