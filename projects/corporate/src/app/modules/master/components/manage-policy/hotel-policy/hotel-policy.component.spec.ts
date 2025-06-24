import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPolicyComponent } from './hotel-policy.component';

describe('HotelPolicyComponent', () => {
  let component: HotelPolicyComponent;
  let fixture: ComponentFixture<HotelPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
