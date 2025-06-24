import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSummaryComponent } from './retail-summary.component';

describe('RetailSummaryComponent', () => {
  let component: RetailSummaryComponent;
  let fixture: ComponentFixture<RetailSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
