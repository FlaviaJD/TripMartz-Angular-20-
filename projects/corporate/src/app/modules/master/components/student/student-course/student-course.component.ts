import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-student-course",
  templateUrl: "./student-course.component.html",
  styleUrls: ["./student-course.component.scss"],
})
export class StudentCourseComponent implements OnInit {
  @ViewChild("tabs", { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.select("studentCourseList");
    });
  }

  beforeChange(e) {}

  triggerTab(data: any) {
    if (data) this.tabs.select(data.tabId);
  }
}
