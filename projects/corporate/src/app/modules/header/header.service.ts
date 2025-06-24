import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  corporateData = new BehaviorSubject<boolean>(true);
  constructor() { 

  }
}
