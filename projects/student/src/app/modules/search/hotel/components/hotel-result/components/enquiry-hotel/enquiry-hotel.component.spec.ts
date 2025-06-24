import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryHotelComponent } from './enquiry-hotel.component';

describe('EnquiryHotelComponent', () => {
  let component: EnquiryHotelComponent;
  let fixture: ComponentFixture<EnquiryHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnquiryHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
