import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPriceFilterComponent } from './bus-price-filter.component';

describe('BusPriceFilterComponent', () => {
  let component: BusPriceFilterComponent;
  let fixture: ComponentFixture<BusPriceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusPriceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusPriceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
