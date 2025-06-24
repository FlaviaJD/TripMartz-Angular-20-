import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAmenitiesListComponent } from './room-amenities-list.component';

describe('RoomAmenitiesListComponent', () => {
  let component: RoomAmenitiesListComponent;
  let fixture: ComponentFixture<RoomAmenitiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAmenitiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAmenitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
