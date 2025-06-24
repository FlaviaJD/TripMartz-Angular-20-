import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMisDownloadsComponent } from './cms-mis-downloads.component';

describe('CmsMisDownloadsComponent', () => {
  let component: CmsMisDownloadsComponent;
  let fixture: ComponentFixture<CmsMisDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsMisDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMisDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
