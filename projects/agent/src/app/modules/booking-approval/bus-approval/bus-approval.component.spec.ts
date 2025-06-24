import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusApprovalComponent } from './bus-approval.component';

describe('BusApprovalComponent', () => {
  let component: BusApprovalComponent;
  let fixture: ComponentFixture<BusApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
