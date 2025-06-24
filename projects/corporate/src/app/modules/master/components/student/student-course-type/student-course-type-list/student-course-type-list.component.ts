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
  selector: "app-student-course-type-list",
  templateUrl: "./student-course-type-list.component.html",
  styleUrls: ["./student-course-type-list.component.scss"],
})
export class StudentCourseTypeListComponent implements OnInit, OnDestroy {
  @Output() courseTypeUpdate = new EventEmitter<any>();
  public pageSize = 10;
  public page = 1;
  public collectionSize: number;
  public displayColumn: { key: string; value: string }[] = [
    { key: "Slno", value: "SNo." },
    { key: "action", value: "Actions" },
    { key: "course_type_id", value: "Course Type ID" },
    { key: "course_type_name", value: "Course Type Name" },
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
    this.getCourseTypeList();
    this.searchText = "";
  }

  onCourseTypeUpdate(data): void {
    this.masterService.studentCourseTypeData.next(data);
    this.courseTypeUpdate.emit({ tabId: "create/update_course_type", data });
  }

  getCourseTypeList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("courseTypeList", "post", {}, {})
      .subscribe(
        (res) => {
          console.log(res);
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.respData = res.data;
            this.noData = false;
            this.collectionSize = res.data.length;
          }
        },
        (err: HttpErrorResponse) => {
          this.swalService.alert.error(err["error"]["Message"]);
        }
      );
  }

  sortData(sort: Sort) {}

  onCourseDelete(data) {}

  exportAsExcel() {
    // const fileToExport = this.respData.map((response: any, index: number) => {
    //   return {
    //     "Sl No.": index + 1,
    //     "Department ID": response.department_id,
    //     Name: response.department_name,
    //   };
    // });
    // const columnWidths = [{ wch: 5 }, { wch: 20 }, { wch: 30 }];
    // this.utility.exportToExcel(
    //   fileToExport,
    //   "Student Course Type",
    //   columnWidths
    // );
  }

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
