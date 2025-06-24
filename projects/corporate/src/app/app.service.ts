import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    
    defaultCurrency = "INR"
    countryCode = "+880"; // Bangladesh phone_code
    countryId = "18"; // Bangladesh 

    constructor() { }
    
}