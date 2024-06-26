import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapComponent } from '../map/map.component';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { BudgetCalculatorComponent } from '../budget-calculator/budget-calculator.component';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [ReactiveFormsModule, MapComponent, WeatherWidgetComponent, BudgetCalculatorComponent],
  template: `
    <h2>Plan Your Trip</h2>
    <form [formGroup]="tripForm" (ngSubmit)="onSubmit()">
      <input formControlName="destination" placeholder="Destination">
      <input formControlName="startDate" type="date">
      <input formControlName="endDate" type="date">
      <button type="submit" class="btn btn-primary">Save Trip</button>
    </form>
    <app-map [destination]="tripForm.get('destination')?.value"></app-map>
    <app-weather-widget [location]="tripForm.get('destination')?.value"></app-weather-widget>
    <app-budget-calculator></app-budget-calculator>
  `,
  styleUrls: ['./trip-planner.component.scss']
})
export class TripPlannerComponent {
  tripForm = this.fb.group({
    destination: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.tripForm.valid) {
      console.log(this.tripForm.value);
      // Tu dodamy logikę zapisywania podróży
    }
  }
}
