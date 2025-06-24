import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusPolicyComponent } from './bus-policy.component';

describe('BusPolicyComponent', () => {
  let component: BusPolicyComponent;
  let fixture: ComponentFixture<BusPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
