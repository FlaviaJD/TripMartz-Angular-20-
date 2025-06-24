import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelApprovalTemplateComponent } from './hotel-approval-template.component';

describe('HotelApprovalTemplateComponent', () => {
  let component: HotelApprovalTemplateComponent;
  let fixture: ComponentFixture<HotelApprovalTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelApprovalTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelApprovalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
