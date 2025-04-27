import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonControllersComponent } from './skeleton-controllers.component';

describe('SkeletonControllersComponent', () => {
  let component: SkeletonControllersComponent;
  let fixture: ComponentFixture<SkeletonControllersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonControllersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonControllersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
