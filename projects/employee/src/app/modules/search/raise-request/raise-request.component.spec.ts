import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseRequestComponent } from './raise-request.component';

describe('RaiseRequestComponent', () => {
  let component: RaiseRequestComponent;
  let fixture: ComponentFixture<RaiseRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
