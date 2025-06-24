import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainerVenueComponent } from './add-trainer-venue.component';

describe('AddTrainerVenueComponent', () => {
  let component: AddTrainerVenueComponent;
  let fixture: ComponentFixture<AddTrainerVenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrainerVenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrainerVenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
