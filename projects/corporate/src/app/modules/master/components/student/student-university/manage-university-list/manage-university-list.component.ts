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
  selector: "app-manage-university-list",
  templateUrl: "./manage-university-list.component.html",
  styleUrls: ["./manage-university-list.component.scss"],
})
export class ManageUniversityListComponent implements OnInit, OnDestroy {
  @Output() universityUpdate = new EventEmitter<any>();
  public pageSize = 10;
  public page = 1;
  public collectionSize: number;
  public displayColumn: { key: string; value: string }[] = [
    { key: "Slno", value: "SNo." },
    { key: "action", value: "Actions" },
    { key: "university_id", value: "University ID" },
    { key: "university_name", value: "University Name" },
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
    this.getUniversityList();
    this.searchText = "";
  }

  getUniversityList() {
    this.subSunk.sink = this.apiHandlerService
      .apiHandler("universitiesList", "post", {}, {})
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

  onUniversityUpdate(data): void {
    this.masterService.studentUniversityData.next(data);
    this.universityUpdate.emit({ tabId: "create/update_university", data });
  }

  sortData(sort: Sort) {}

  onCourseDelete(data) {}

  exportAsExcel() {
    // const fileToExport = this.respData.map((response: any, index: number) => {
    //   return {
    //     "Sl No.": index + 1,
    //     "University ID": response.uni_id,
    //     "University Name": response.uni_name,
    //   };
    // });
    // const columnWidths = [{ wch: 5 }, { wch: 20 }, { wch: 30 }];
    // this.utility.exportToExcel(
    //   fileToExport,
    //   "Student University List",
    //   columnWidths
    // );
  }

  ngOnDestroy(): void {
    this.subSunk.unsubscribe();
  }
}
