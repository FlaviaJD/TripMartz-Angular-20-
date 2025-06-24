import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCostCenterComponent } from './create-update-cost-center.component';

describe('CreateUpdateCostCenterComponent', () => {
  let component: CreateUpdateCostCenterComponent;
  let fixture: ComponentFixture<CreateUpdateCostCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateUpdateCostCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateCostCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
