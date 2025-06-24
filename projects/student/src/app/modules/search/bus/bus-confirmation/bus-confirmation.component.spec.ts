import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusConfirmationComponent } from './bus-confirmation.component';

describe('BusConfirmationComponent', () => {
  let component: BusConfirmationComponent;
  let fixture: ComponentFixture<BusConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
