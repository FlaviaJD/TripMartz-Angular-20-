import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
  airlineUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  airportUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  countryUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  stateUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  cityUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  employeeUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
    ) { }


}
