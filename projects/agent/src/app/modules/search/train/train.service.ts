import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
    bookingType = new BehaviorSubject<any>('Self');
    enableBooking = new BehaviorSubject<boolean>(true);
  constructor() { }
}
