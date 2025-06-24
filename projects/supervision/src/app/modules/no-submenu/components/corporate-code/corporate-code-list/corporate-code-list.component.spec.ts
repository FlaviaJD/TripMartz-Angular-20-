import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCodeListComponent } from './corporate-code-list.component';

describe('CorporateCodeListComponent', () => {
  let component: CorporateCodeListComponent;
  let fixture: ComponentFixture<CorporateCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateCodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
