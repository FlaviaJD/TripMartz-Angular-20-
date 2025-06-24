import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusCancellationComponent } from './bus-cancellation.component';

describe('BusCancellationComponent', () => {
  let component: BusCancellationComponent;
  let fixture: ComponentFixture<BusCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusCancellationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
