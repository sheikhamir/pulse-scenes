import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcsControlsComponent } from './pcs-controls.component';

describe('PcsControlsComponent', () => {
  let component: PcsControlsComponent;
  let fixture: ComponentFixture<PcsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcsControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
