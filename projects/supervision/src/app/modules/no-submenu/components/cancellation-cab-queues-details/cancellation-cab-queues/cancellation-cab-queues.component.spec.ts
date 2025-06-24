import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationCabQueuesComponent } from './cancellation-cab-queues.component';

describe('CancellationCabQueuesComponent', () => {
  let component: CancellationCabQueuesComponent;
  let fixture: ComponentFixture<CancellationCabQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationCabQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationCabQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
