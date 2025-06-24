import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCancelRequestComponent } from './hotel-cancel-request.component';

describe('HotelCancelRequestComponent', () => {
  let component: HotelCancelRequestComponent;
  let fixture: ComponentFixture<HotelCancelRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCancelRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCancelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
