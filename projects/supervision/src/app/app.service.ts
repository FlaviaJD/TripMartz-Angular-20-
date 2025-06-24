import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    
    defaultCurrency = "INR"
    countryCode = "91"; // Bangladesh phone_code
    countryId = "151"; // Bangladesh 

    constructor() { }
    
}