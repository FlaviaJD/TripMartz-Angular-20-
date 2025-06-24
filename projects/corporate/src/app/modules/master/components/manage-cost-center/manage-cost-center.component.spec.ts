import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCostCenterComponent } from './manage-cost-center.component';

describe('ManageCostCenterComponent', () => {
  let component: ManageCostCenterComponent;
  let fixture: ComponentFixture<ManageCostCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCostCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCostCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
