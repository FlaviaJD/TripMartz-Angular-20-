import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BaseLayoutComponent } from "../../layout/base-layout/base-layout.component";
import { AuthGuard } from "../../auth/auth.guard";
import { ManageCostCenterComponent } from "./components/manage-cost-center/manage-cost-center.component";
import { ManageDepartmentComponent } from "./components/manage-department/manage-department.component";
import { ManagePurposeComponent } from "./components/manage-purpose/manage-purpose.component";
import { ManageEmployeeComponent } from "./components/manage-employee/manage-employee.component";
import { ManagePolicyComponent } from "./components/manage-policy/manage-policy.component";
import { PolicyListComponent } from "./components/policy-list/policy-list.component";
import { ManagePositionComponent } from "./components/manage-position/manage-position.component";
import { FlightPolicyComponent } from "./components/manage-policy/flight-policy/flight-policy.component";
import { HotelPolicyComponent } from "./components/manage-policy/hotel-policy/hotel-policy.component";
import { TrainPolicyComponent } from "./components/manage-policy/train-policy/train-policy.component";
import { BusPolicyComponent } from "./components/manage-policy/bus-policy/bus-policy.component";
import { CabPolicyComponent } from "./components/manage-policy/cab-policy/cab-policy.component";
import { EmployeeAprrovalCreateComponent } from "./components/employee-approval/employee-aprroval-create/employee-aprroval-create.component";
import { EmployeeApprovalComponent } from "./components/employee-approval/employee-approval.component";
import { ManageUniversityComponent } from "./components/student/student-university/manage-university.component";
import { StudentCourseTypeComponent } from "./components/student/student-course-type/student-course-type.component";
import { StudentCourseComponent } from "./components/student/student-course/student-course.component";
import { CourseDurationComponent } from "./components/student/student-course-duration/course-duration.component";
import { StudentInformationComponent } from "./components/student/student-information/student-information.component";


const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "manage-cost-center",
        canActivate: [AuthGuard],
        component: ManageCostCenterComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-department",
        canActivate: [AuthGuard],
        component: ManageDepartmentComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-purpose",
        canActivate: [AuthGuard],
        component: ManagePurposeComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-employee",
        canActivate: [AuthGuard],
        component: ManageEmployeeComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-policy",
        canActivate: [AuthGuard],
        component: ManagePolicyComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "policy-list",
        canActivate: [AuthGuard],
        component: PolicyListComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-position",
        canActivate: [AuthGuard],
        component: ManagePositionComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-policy-flight",
        canActivate: [AuthGuard],
        component: FlightPolicyComponent
      },
      {
        path: "manage-policy-hotel",
        canActivate: [AuthGuard],
        component: HotelPolicyComponent
      },
      {
        path: "manage-policy-train",
        canActivate: [AuthGuard],
        component: TrainPolicyComponent
      },
      {
        path: "manage-policy-bus",
        canActivate: [AuthGuard],
        component: BusPolicyComponent
      }, 
      {
        path: "manage-policy-cab",
        canActivate: [AuthGuard],
        component: CabPolicyComponent
      },
      {
        path: "employee-approval-create",
        canActivate: [AuthGuard],
        component: EmployeeApprovalComponent,
        data: { extraParameter: "masterMenus" },
      },
      {
        path: "manage-student-universities",
        canActivate: [AuthGuard],
        component: ManageUniversityComponent,
        data: { extraParameter: "ManageStudentsMenus" }
      },
      {
        path: "manage-student-information",
        canActivate: [AuthGuard],
        component: StudentInformationComponent,
        data: { extraParameter: "ManageStudentsMenus" }
      },
      {
        path: "manage-student-course-type",
        canActivate: [AuthGuard],
        component: StudentCourseTypeComponent,
        data: { extraParameter: "ManageStudentsMenus" }
      },
      {
        path: "manage-student-course-name",
        canActivate: [AuthGuard],
        component: StudentCourseComponent,
        data: { extraParameter: "ManageStudentsMenus" }
      },
      {
        path: "manage-course-duration",
        canActivate: [AuthGuard],
        component: CourseDurationComponent,
        data: { extraParameter: "ManageStudentsMenus" }
      }
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
