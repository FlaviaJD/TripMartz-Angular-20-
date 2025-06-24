import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateSummaryComponent } from './corporate-summary.component';

describe('CorporateSummaryComponent', () => {
  let component: CorporateSummaryComponent;
  let fixture: ComponentFixture<CorporateSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
