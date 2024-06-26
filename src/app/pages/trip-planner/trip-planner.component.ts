import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GoogleMapComponent } from '../../components/google-map/google-map.component';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GoogleMapComponent],
  template: `
    <div class="trip-planner-container">
      <h2>Zaplanuj swoją podróż</h2>
      <form [formGroup]="tripForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="destination">Cel podróży</label>
          <input id="destination" type="text" formControlName="destination" />
          <div
            *ngIf="
              tripForm.get('destination')?.invalid &&
              tripForm.get('destination')?.touched
            "
            class="error-message"
          >
            Proszę podać cel podróży.
          </div>
        </div>

        <!-- Pozostałe pola formularza -->

        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="!tripForm.valid"
        >
          Zaplanuj podróż
        </button>
      </form>

      <app-google-map
        [destination]="tripForm.get('destination')?.value"
      ></app-google-map>
    </div>
  `,
  styleUrls: ['./trip-planner.component.scss'],
})
export class TripPlannerComponent {
  tripForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tripForm = this.fb.group({
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      travelers: [1, [Validators.required, Validators.min(1)]],
      budget: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.tripForm.valid) {
      console.log('Trip details:', this.tripForm.value);
      // Tutaj dodamy logikę zapisywania/przetwarzania danych podróży
    }
  }
}
