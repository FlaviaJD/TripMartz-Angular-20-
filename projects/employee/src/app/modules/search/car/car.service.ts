import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  enableBooking = new BehaviorSubject<boolean>(true);
  constructor() { }
}
