import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabMisDownloadsComponent } from './cab-mis-downloads.component';

describe('CabMisDownloadsComponent', () => {
  let component: CabMisDownloadsComponent;
  let fixture: ComponentFixture<CabMisDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabMisDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabMisDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
