import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarkupService {

    toUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    agentMarkupDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    selectedAgent: BehaviorSubject<any> = new BehaviorSubject<any>({});
    toUpdateB2CData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    agentMarkupB2CDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
    isEditMode = false;
    constructor() { }
}
