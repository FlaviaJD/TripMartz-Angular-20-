import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AirlineGSTService {
  updateData: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() { }
}
