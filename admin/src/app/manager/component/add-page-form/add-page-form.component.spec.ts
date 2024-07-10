import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPageFormComponent } from './add-page-form.component';

describe('AddPageFormComponent', () => {
  let component: AddPageFormComponent;
  let fixture: ComponentFixture<AddPageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPageFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
