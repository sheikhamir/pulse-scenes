import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitLoaderComponent } from './init-loader.component';

describe('InitLoaderComponent', () => {
  let component: InitLoaderComponent;
  let fixture: ComponentFixture<InitLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
