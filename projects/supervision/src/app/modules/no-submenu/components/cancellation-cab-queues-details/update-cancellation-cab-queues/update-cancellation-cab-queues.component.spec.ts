import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCancellationCabQueuesComponent } from './update-cancellation-cab-queues.component';

describe('UpdateCancellationCabQueuesComponent', () => {
  let component: UpdateCancellationCabQueuesComponent;
  let fixture: ComponentFixture<UpdateCancellationCabQueuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCancellationCabQueuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCancellationCabQueuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
