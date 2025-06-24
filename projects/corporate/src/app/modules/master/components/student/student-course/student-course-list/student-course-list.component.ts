import {
  Component,
  OnInit,
  Output,
  EventEmitter,
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
  selector: "app-student-course-list",
  templateUrl: "./student-course-list.component.html",
  styleUrls: ["./student-course-list.component.scss"],
})
export class StudentCourseListComponent implements OnInit, OnDestroy {
  @Output() courseListUpdate = new EventEmitter<any>();
  public pageSize = 10;
  public page = 1;
  public collectionSize: number;
  public displayColumn: { key: string; value: string }[] = [
    { key: "Slno", value: "SNo." },
    { key: "action", value: "Actions" },
    { key: "course_id", value: "Course ID" },
    { key: "course_type", value: "Course Type" },
        { key: "course_name", value: "Course Name" },
  ];
  public noData: boolean = true;
  public respData: [] = [];
  public status;
  public searchText: string = "";
  private subSunk = new SubSink();

  constructor(
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.onLoad();
  }

  onLoad() {
    this.getCourseList();
    this.searchText = "";
  }

  onCourseUpdate(data): void {
    this.masterService.studentCourseUpdateData.next(data);
    this.courseListUpdate.emit({ tabId: "create/update_student_course", data });
  }
  sortData(sort: Sort) {}

  onCourseDelete(data) {}

  exportAsExcel() {
    // const fileToExport = this.respData.map((response: any, index: number) => {
    //   return {
    //     "Sl No.": index + 1,
    //     "Course ID": response.course_id,
    //     Name: response.course_name,
    //   };
    // });
    // const columnWidths = [{ wch: 5 }, { wch: 20 }, { wch: 30 }];
    // this.utility.exportToExcel(
    //   fileToExport,
    //   "Student Course Name",
    //   columnWidths
    // );
  }

  getCourseList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("courseNameList", "post", {}, {})
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

  ngOnDestroy() {
    this.subSunk.unsubscribe();
  }
}
