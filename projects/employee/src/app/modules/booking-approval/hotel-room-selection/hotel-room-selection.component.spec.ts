import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRoomSelectionComponent } from './hotel-room-selection.component';

describe('HotelRoomSelectionComponent', () => {
  let component: HotelRoomSelectionComponent;
  let fixture: ComponentFixture<HotelRoomSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRoomSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRoomSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
