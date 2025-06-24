import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationCabQueuesDetailsComponent } from './cancellation-cab-queues-details.component';

describe('CancellationCabQueuesDetailsComponent', () => {
  let component: CancellationCabQueuesDetailsComponent;
  let fixture: ComponentFixture<CancellationCabQueuesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancellationCabQueuesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancellationCabQueuesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
