import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoomAmenitiesComponent } from './add-room-amenities.component';

describe('AddRoomAmenitiesComponent', () => {
  let component: AddRoomAmenitiesComponent;
  let fixture: ComponentFixture<AddRoomAmenitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRoomAmenitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRoomAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
