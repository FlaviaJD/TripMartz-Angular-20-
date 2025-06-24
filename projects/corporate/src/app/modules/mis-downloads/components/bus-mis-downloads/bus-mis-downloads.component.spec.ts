import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusMisDownloadsComponent } from './bus-mis-downloads.component';

describe('BusMisDownloadsComponent', () => {
  let component: BusMisDownloadsComponent;
  let fixture: ComponentFixture<BusMisDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusMisDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusMisDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
