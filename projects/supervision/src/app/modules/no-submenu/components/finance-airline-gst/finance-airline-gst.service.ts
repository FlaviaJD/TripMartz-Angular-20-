import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class FinanceAirlineGSTService {
  updateData: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() { }
}
