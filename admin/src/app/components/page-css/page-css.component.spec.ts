import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCssComponent } from './page-css.component';

describe('PageCssComponent', () => {
  let component: PageCssComponent;
  let fixture: ComponentFixture<PageCssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCssComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageCssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
