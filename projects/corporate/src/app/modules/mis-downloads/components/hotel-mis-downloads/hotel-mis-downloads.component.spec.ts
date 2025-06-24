import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelMisDownloadsComponent } from './hotel-mis-downloads.component';

describe('HotelMisDownloadsComponent', () => {
  let component: HotelMisDownloadsComponent;
  let fixture: ComponentFixture<HotelMisDownloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelMisDownloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelMisDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
