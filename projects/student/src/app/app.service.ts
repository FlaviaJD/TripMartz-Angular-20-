import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    defaultCurrency = "INR";
    isCorporateSelected=new BehaviorSubject<boolean>(false);
    isStateSelected=new BehaviorSubject<boolean>(false);
    constructor() { }

}
