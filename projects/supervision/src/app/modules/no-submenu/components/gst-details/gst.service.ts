import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GstService {

  gstUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
    ) { }


}
