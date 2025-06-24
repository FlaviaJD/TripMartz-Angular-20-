import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-training-name',
  templateUrl: './add-training-name.component.html',
  styleUrls: ['./add-training-name.component.scss']
})
export class AddTrainingNameComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  constructor() { }

  ngOnInit() {
  }

}
