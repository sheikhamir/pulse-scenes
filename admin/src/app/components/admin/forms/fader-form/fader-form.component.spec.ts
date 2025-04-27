import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaderFormComponent } from './fader-form.component';

describe('FaderFormComponent', () => {
  let component: FaderFormComponent;
  let fixture: ComponentFixture<FaderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaderFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
