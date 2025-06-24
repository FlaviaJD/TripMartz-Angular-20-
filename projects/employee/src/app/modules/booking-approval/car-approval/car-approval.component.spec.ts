import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarApprovalComponent } from './car-approval.component';

describe('CarApprovalComponent', () => {
  let component: CarApprovalComponent;
  let fixture: ComponentFixture<CarApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
