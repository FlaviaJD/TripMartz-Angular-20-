import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelApprovalComponent } from './hotel-approval.component';

describe('HotelApprovalComponent', () => {
  let component: HotelApprovalComponent;
  let fixture: ComponentFixture<HotelApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
