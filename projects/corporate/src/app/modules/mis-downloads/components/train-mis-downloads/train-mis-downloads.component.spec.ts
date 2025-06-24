import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainMisDownloadsComponent } from './train-mis-downloads.component';

describe('TrainMisDownloadsComponent', () => {
  let component: TrainMisDownloadsComponent;
  let fixture: ComponentFixture<TrainMisDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainMisDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainMisDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
