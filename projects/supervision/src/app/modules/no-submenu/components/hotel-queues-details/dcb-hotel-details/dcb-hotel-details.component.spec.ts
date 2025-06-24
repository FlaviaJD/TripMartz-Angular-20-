import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcbHotelDetailsComponent } from './dcb-hotel-details.component';

describe('DcbHotelDetailsComponent', () => {
  let component: DcbHotelDetailsComponent;
  let fixture: ComponentFixture<DcbHotelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcbHotelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcbHotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
