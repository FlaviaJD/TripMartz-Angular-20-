import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-student-information",
  templateUrl: "./student-information.component.html",
  styleUrls: ["./student-information.component.scss"],
})
export class StudentInformationComponent implements OnInit {
  @ViewChild("tabs", { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.select("studentsInformation");
    });
  }

  beforeChange(e) {}

  triggerTab(data: any) {
    if (data) this.tabs.select(data.tabId);
  }
}
