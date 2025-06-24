import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TripIdService {
    tripData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor() { }
}
