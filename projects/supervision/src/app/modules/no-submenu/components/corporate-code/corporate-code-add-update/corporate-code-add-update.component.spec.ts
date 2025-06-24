import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCodeAddUpdateComponent } from './corporate-code-add-update.component';

describe('CorporateCodeAddUpdateComponent', () => {
  let component: CorporateCodeAddUpdateComponent;
  let fixture: ComponentFixture<CorporateCodeAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateCodeAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateCodeAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
