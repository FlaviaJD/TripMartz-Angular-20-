import { Component, OnInit, ViewChild } from "@angular/core";
import { NgbTabset } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-manage-university",
  templateUrl: "./manage-university.component.html",
  styleUrls: ["./manage-university.component.scss"],
})
export class ManageUniversityComponent implements OnInit {
  @ViewChild("tabs", { static: true }) public tabs: NgbTabset;

  hotelData: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabs.select("studentsUniversity");
    });
  }

  beforeChange(e) {}

  triggerTab(data: any) {
    if (data) this.tabs.select(data.tabId);
  }
}
