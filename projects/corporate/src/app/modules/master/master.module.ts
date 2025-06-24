import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MasterRoutingModule } from "./master-rounting.module";
import { SharedModule } from "../../shared/shared.module";
import { LayoutsModule } from "../../layout/layout.module";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { ManageCostCenterComponent } from "./components/manage-cost-center/manage-cost-center.component";
import { ManageDepartmentComponent } from "./components/manage-department/manage-department.component";
import { ManagePurposeComponent } from "./components/manage-purpose/manage-purpose.component";
import { ManageEmployeeComponent } from "./components/manage-employee/manage-employee.component";
import { ManagePolicyComponent } from "./components/manage-policy/manage-policy.component";
import { PolicyListComponent } from "./components/policy-list/policy-list.component";
import { ManagePositionComponent } from "./components/manage-position/manage-position.component";
import { CreateUpdateCostCenterComponent } from "./components/manage-cost-center/create-update-cost-center/create-update-cost-center.component";
import { CostCenterListComponent } from "./components/manage-cost-center/cost-center-list/cost-center-list.component";
import { CreateUpdateDepartmentComponent } from "./components/manage-department/create-update-department/create-update-department.component";
import { DepartmentListComponent } from "./components/manage-department/department-list/department-list.component";
import { CreateUpdatePurposeComponent } from "./components/manage-purpose/create-update-purpose/create-update-purpose.component";
import { PurposeListComponent } from "./components/manage-purpose/purpose-list/purpose-list.component";
import { CreateUpdateEmployeeComponent } from "./components/manage-employee/create-update-employee/create-update-employee.component";
import { EmployeeListComponent } from "./components/manage-employee/employee-list/employee-list.component";
import { CreateUpdatePositionComponent } from "./components/manage-position/create-update-position/create-update-position.component";
import { PositionListComponent } from "./components/manage-position/position-list/position-list.component";
import { FlightPolicyComponent } from "./components/manage-policy/flight-policy/flight-policy.component";
import { HotelPolicyComponent } from "./components/manage-policy/hotel-policy/hotel-policy.component";
import { TrainPolicyComponent } from "./components/manage-policy/train-policy/train-policy.component";
import { BusPolicyComponent } from "./components/manage-policy/bus-policy/bus-policy.component";
import { CabPolicyComponent } from "./components/manage-policy/cab-policy/cab-policy.component";
import { CsvUploadedDataComponent } from "./components/manage-employee/csv-uploaded-data/csv-uploaded-data.component";
import { FlightCityListComponent } from "./components/manage-policy/flight-city-list/flight-city-list.component";
import { EmployeeAprrovalCreateComponent } from "./components/employee-approval/employee-aprroval-create/employee-aprroval-create.component";
import { EmployeeApprovalComponent } from "./components/employee-approval/employee-approval.component";
import { EmployeeApprovalListComponent } from "./components/employee-approval/employee-approval-list/employee-approval-list.component";
import { CreateUpdateCourseComponent } from "./components/student/student-course/create-update-course/create-update-course.component";
import { StudentCourseListComponent } from "./components/student/student-course/student-course-list/student-course-list.component";
import { StudentCourseComponent } from "./components/student/student-course/student-course.component";
import { CreateUpdateTypeComponent } from "./components/student/student-course-type/create-update-type/create-update-type.component";
import { StudentCourseTypeListComponent } from "./components/student/student-course-type/student-course-type-list/student-course-type-list.component";
import { StudentCourseTypeComponent } from "./components/student/student-course-type/student-course-type.component";
import { CreateUpdateUniversityComponent } from "./components/student/student-university/create-update-university/create-update-university.component";
import { ManageUniversityListComponent } from "./components/student/student-university/manage-university-list/manage-university-list.component";
import { ManageUniversityComponent } from "./components/student/student-university/manage-university.component";
import { CourseDurationComponent } from "./components/student/student-course-duration/course-duration.component";
import { CourseDurationListComponent } from "./components/student/student-course-duration/course-duration-list/course-duration-list.component";
import { CreateUpdateDurationComponent } from "./components/student/student-course-duration/create-update-duration/create-update-duration.component";
import { StudentInformationComponent } from "./components/student/student-information/student-information.component";
import { StudentInformationListComponent } from "./components/student/student-information/student-information-list/student-information-list.component";
import { CreateUpdateStudentInfoComponent } from "./components/student/student-information/create-update-student-info/create-update-student-info.component";
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
    declarations: [
      ManageCostCenterComponent,
      ManageDepartmentComponent,
      ManagePurposeComponent,
      ManageEmployeeComponent,
      ManagePolicyComponent,
      PolicyListComponent,
      ManagePositionComponent,
      CreateUpdateCostCenterComponent,
      CostCenterListComponent,
      CreateUpdateDepartmentComponent,
      DepartmentListComponent,
      CreateUpdatePurposeComponent,
      PurposeListComponent,
      CreateUpdateEmployeeComponent,
      EmployeeListComponent,
      CreateUpdatePositionComponent,
      PositionListComponent,
      FlightPolicyComponent,
      HotelPolicyComponent,
      TrainPolicyComponent,
      FlightCityListComponent,
      BusPolicyComponent,
      CabPolicyComponent,
      EmployeeAprrovalCreateComponent,
      EmployeeApprovalListComponent,
      EmployeeApprovalComponent,
      CsvUploadedDataComponent,
      CreateUpdateCourseComponent,
      StudentCourseListComponent,
      StudentCourseComponent,
      CreateUpdateTypeComponent,
      StudentCourseTypeListComponent,
      StudentCourseTypeComponent,
      CreateUpdateUniversityComponent,
      ManageUniversityListComponent,
      ManageUniversityComponent,
      CourseDurationComponent,
      CourseDurationListComponent,
      CreateUpdateDurationComponent,
      StudentInformationComponent,
      StudentInformationListComponent,
      CreateUpdateStudentInfoComponent
    ],
    imports: [
      CommonModule,
      MasterRoutingModule,
      SharedModule,
      LayoutsModule,
      Ng2SearchPipeModule,
      MatAutocompleteModule,
      MatInputModule,
      MatSelectModule,
      MatFormFieldModule,
      NgMultiSelectDropDownModule.forRoot(),
    ],
  })
  export class MasterModule {}
  