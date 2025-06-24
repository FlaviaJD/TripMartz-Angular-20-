import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-trainer-venue',
  templateUrl: './add-trainer-venue.component.html',
  styleUrls: ['./add-trainer-venue.component.scss']
})
export class AddTrainerVenueComponent implements OnInit {
    @ViewChild('tabs', { static: true }) public tabs: NgbTabset;

  constructor() { }

  ngOnInit() {
  }

}
