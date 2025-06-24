import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-trainer-name',
  templateUrl: './add-trainer-name.component.html',
  styleUrls: ['./add-trainer-name.component.scss']
})
export class AddTrainerNameComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;
  constructor() { }

  ngOnInit() {
  }

}
