import { Injectable } from '@angular/core';
import { ApiHandlerService } from 'projects/supervision/src/app/core/api-handlers';
import { untilDestroyed } from 'projects/supervision/src/app/core/services/until-destroyed';
import { map, shareReplay } from 'rxjs/operators';
import { UtilityService } from 'projects/supervision/src/app/core/services/utility.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  isDevelopement: BehaviorSubject<boolean> = new BehaviorSubject(false);
  costCenterUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  departmentUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  purposeUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  positionUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  policyUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  employeeUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  golobalPositionName:BehaviorSubject<any>=new BehaviorSubject<any>({});
  flightPolicyData:BehaviorSubject<any>=new BehaviorSubject<any>({});
  hotelPolicyData:BehaviorSubject<any>=new BehaviorSubject<any>({});
  busPolicyData:BehaviorSubject<any>=new BehaviorSubject<any>({});
  cabPolicyData:BehaviorSubject<any>=new BehaviorSubject<any>({});
  trainPolicyData:BehaviorSubject<any>=new BehaviorSubject<any>({});
  cityUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  approvalUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  studentCourseUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  studentCourseDurationData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  studentCourseTypeData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  studentUniversityData: BehaviorSubject<any> = new BehaviorSubject<any>({});
  studentInformationData: BehaviorSubject<any> = new BehaviorSubject<any>({});
//   departmentUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
//   departmentUpdateData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    constructor(
        private apiHandlerService: ApiHandlerService,
        private utility: UtilityService,
        private httpClient: HttpClient
    ) { }


}
