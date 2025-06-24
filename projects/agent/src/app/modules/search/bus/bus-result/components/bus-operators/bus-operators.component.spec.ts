import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusOperatorsComponent } from './bus-operators.component';

describe('BusOperatorsComponent', () => {
  let component: BusOperatorsComponent;
  let fixture: ComponentFixture<BusOperatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusOperatorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
