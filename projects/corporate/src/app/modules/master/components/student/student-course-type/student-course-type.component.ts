import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-student-course-type",
  templateUrl: "./student-course-type.component.html",
  styleUrls: ["./student-course-type.component.scss"],
})
export class StudentCourseTypeComponent implements OnInit {
  @ViewChild("tabs", { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.select("studentCourseType");
    });
  }

  beforeChange(e) {}

  triggerTab(data: any) {
    if (data) this.tabs.select(data.tabId);
  }
}
