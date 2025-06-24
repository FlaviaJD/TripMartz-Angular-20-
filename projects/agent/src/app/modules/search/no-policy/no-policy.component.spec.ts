import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPolicyComponent } from './no-policy.component';

describe('NoPolicyComponent', () => {
  let component: NoPolicyComponent;
  let fixture: ComponentFixture<NoPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
