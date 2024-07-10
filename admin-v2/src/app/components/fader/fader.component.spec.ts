import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaderComponent } from './fader.component';

describe('FaderComponent', () => {
  let component: FaderComponent;
  let fixture: ComponentFixture<FaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
