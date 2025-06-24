import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusLoaderComponent } from './bus-loader.component';

describe('BusLoaderComponent', () => {
  let component: BusLoaderComponent;
  let fixture: ComponentFixture<BusLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
