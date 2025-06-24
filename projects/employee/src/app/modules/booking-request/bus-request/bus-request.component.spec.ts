import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusRequestComponent } from './bus-request.component';

describe('BusRequestComponent', () => {
  let component: BusRequestComponent;
  let fixture: ComponentFixture<BusRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
