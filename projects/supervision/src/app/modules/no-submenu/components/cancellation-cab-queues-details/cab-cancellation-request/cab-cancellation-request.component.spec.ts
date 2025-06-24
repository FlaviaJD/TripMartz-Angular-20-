import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabCancellationRequestComponent } from './cab-cancellation-request.component';

describe('CabCancellationRequestComponent', () => {
  let component: CabCancellationRequestComponent;
  let fixture: ComponentFixture<CabCancellationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabCancellationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabCancellationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
