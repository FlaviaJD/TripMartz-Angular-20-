import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class CorporateCodeService {
  updateData: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() { }
}
