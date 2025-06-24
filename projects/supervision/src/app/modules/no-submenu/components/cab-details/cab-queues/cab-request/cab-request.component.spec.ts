import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabRequestComponent } from './cab-request.component';

describe('CabRequestComponent', () => {
  let component: CabRequestComponent;
  let fixture: ComponentFixture<CabRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
