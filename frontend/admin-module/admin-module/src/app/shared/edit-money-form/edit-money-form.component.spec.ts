import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMoneyFormComponent } from './edit-money-form.component';

describe('EditMoneyFormComponent', () => {
  let component: EditMoneyFormComponent;
  let fixture: ComponentFixture<EditMoneyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMoneyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMoneyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
