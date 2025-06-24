import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from "@angular/core";
import { MasterService } from "../../../../master.service";
import { SubSink } from "subsink";
import { SwalService } from "projects/corporate/src/app/core/services/swal.service";
import { UtilityService } from "projects/corporate/src/app/core/services/utility.service";
import { ApiHandlerService } from "projects/corporate/src/app/core/api-handlers";
import { Sort } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-student-information-list",
  templateUrl: "./student-information-list.component.html",
  styleUrls: ["./student-information-list.component.scss"],
})
export class StudentInformationListComponent implements OnInit, OnDestroy {
  @Output() studentInfoUpdate = new EventEmitter<any>();

  public pageSize = 10;
  public page = 1;
  public collectionSize: number;
  public displayColumn: { key: string; value: string }[] = [
    { key: "Slno", value: "SNo." },
    { key: "action", value: "Actions" },
    { key: "status", value: "Status" },
    { key: "uuid", value: "Business ID" },
    { key: "student_name", value: "Student Name" },
    { key: "uni_name", value: "University Name" },
    { key: "course_name", value: "Course Name" },
    { key: "course_type", value: "Course Type" },
    { key: "contact", value: "Contact" },
  ];
  public noData: boolean = true;
  public respData: [] = [];
  public status;
  public searchText: string = "";
  private subSunk = new SubSink();

  constructor(
    private masterService: MasterService,
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    this.getStudentInformationList();
    this.searchText = "";
  }

  onStudentInfoUpdate(data): void {
    this.masterService.studentInformationData.next(data);
    this.studentInfoUpdate.emit({
      tabId: "create/update_student_information",
      data,
    });
  }

  getStudentInformationList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("studentRegistrationList", "post", {}, {})
      .subscribe(
        (resp) => {
          if (resp.statusCode == 200 || resp.statusCode == 201) {
            this.noData = false;
            this.respData = resp.data;
          } else {
            this.noData = false;
            this.swalService.alert.oops();
          }
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this.noData = false;
          this.swalService.alert.oops();
        }
      );
  }

  sortData(sort: Sort) {}

  onCourseDelete(data) {}

  exportAsExcel() {
    const fileToExport = this.respData.map((response: any, index: number) => {
      return {
        "Sl No.": index + 1,
        "Department ID": response.department_id,
        Name: response.department_name,
      };
    });

    const columnWidths = [{ wch: 5 }, { wch: 20 }, { wch: 30 }];

    this.utility.exportToExcel(
      fileToExport,
      "Student Information",
      columnWidths
    );
  }

  onStatusChange(data) {
    // this.subSunk.sink = this.apiHandlerService.apiHandler('updateUserStatus', 'post', {}, {},
    //     { "status": data.status==1 ? 0 : 1, "id": data.id })
    // .subscribe(resp => {
    //     if (resp.statusCode == 200 || resp.statusCode == 201) {
    //         this.swalService.alert.success("User status changed successfully.");
    //     }
    //     else {
    //         this.swalService.alert.oops();
    //     }
    // }, (err: HttpErrorResponse) => {
    //     console.error(err);
    //     this.swalService.alert.oops();
    // }
    // );
  }

  getName(data) {
    return data.first_name + " " + data.last_name;
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
