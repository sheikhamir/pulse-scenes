import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoControllerComponent } from './no-controller.component';

describe('NoControllerComponent', () => {
  let component: NoControllerComponent;
  let fixture: ComponentFixture<NoControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
