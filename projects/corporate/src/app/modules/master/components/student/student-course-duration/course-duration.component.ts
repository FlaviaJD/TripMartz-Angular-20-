import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-course-duration",
  templateUrl: "./course-duration.component.html",
  styleUrls: ["./course-duration.component.scss"],
})
export class CourseDurationComponent implements OnInit {
  @ViewChild("tabs", { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.select("studentCourseDuration");
    });
  }

  beforeChange(e) {}

  triggerTab(data: any) {
    if (data) this.tabs.select(data.tabId);
  }
}
