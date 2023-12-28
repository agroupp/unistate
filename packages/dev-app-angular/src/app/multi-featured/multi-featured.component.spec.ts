import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFeaturedComponent } from './multi-featured.component';

describe('MultiFeaturedComponent', () => {
  let component: MultiFeaturedComponent;
  let fixture: ComponentFixture<MultiFeaturedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiFeaturedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiFeaturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
