import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IcichotelmaterService {

    icicCityUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    icicLocationUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    icicHotelUpdateData:BehaviorSubject<any> = new BehaviorSubject<any>({});
    icicGuestHouseUpdateData:BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor() { }
}
