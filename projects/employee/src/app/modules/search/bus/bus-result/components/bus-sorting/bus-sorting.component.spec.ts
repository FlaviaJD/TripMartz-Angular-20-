import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusSortingComponent } from './bus-sorting.component';

describe('BusSortingComponent', () => {
  let component: BusSortingComponent;
  let fixture: ComponentFixture<BusSortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusSortingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
