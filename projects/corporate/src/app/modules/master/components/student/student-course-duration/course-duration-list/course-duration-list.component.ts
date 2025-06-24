import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MasterService } from "../../../../master.service";
import { SubSink } from "subsink";
import { SettingService } from "../../../../../settings/setting.service";
import { SwalService } from "projects/corporate/src/app/core/services/swal.service";
import { UtilityService } from "projects/corporate/src/app/core/services/utility.service";
import { ApiHandlerService } from "projects/corporate/src/app/core/api-handlers";
import { Sort } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-course-duration-list",
  templateUrl: "./course-duration-list.component.html",
  styleUrls: ["./course-duration-list.component.scss"],
})
export class CourseDurationListComponent implements OnInit {
  @Output() courseDurationUpdate = new EventEmitter<any>();
  public pageSize = 10;
  public page = 1;
  public collectionSize: number;
  public displayColumn: { key: string; value: string }[] = [
    { key: "Slno", value: "SNo." },
    { key: "action", value: "Actions" },
    { key: "course_duration_id", value: "Course Duration ID" },
    { key: "course_duration", value: "Course Duration" },
  ];
  public noData: boolean = true;
  public respData:[] = [];
  public status;
  public searchText: string = "";
  private subSunk = new SubSink();

  constructor(
    private masterService: MasterService,
    private settingService: SettingService,
    private swalService: SwalService,
    private utility: UtilityService,
    private apiHandlerService: ApiHandlerService
  ) {}

  ngOnInit(): void {
    this.noData = false;
    this.searchText = "";
  }

  onCourseDurationUpdate(data): void {
    this.masterService.studentCourseDurationData.next(data);
    this.courseDurationUpdate.emit({
      tabId: "create/update_course_duration",
      data,
    });
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
      "Student Course Duration",
      columnWidths
    );
  }
}
