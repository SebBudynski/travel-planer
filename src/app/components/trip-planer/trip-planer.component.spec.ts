import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPlanerComponent } from './trip-planer.component';

describe('TripPlanerComponent', () => {
  let component: TripPlanerComponent;
  let fixture: ComponentFixture<TripPlanerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripPlanerComponent]
    });
    fixture = TestBed.createComponent(TripPlanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
