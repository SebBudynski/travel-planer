// src/app/pages/trip-edit/trip-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2>Edytuj podróż</h2>
    <form [formGroup]="tripForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="destination">Cel podróży:</label>
        <input id="destination" formControlName="destination" type="text">
      </div>
      <div>
        <label for="startDate">Data rozpoczęcia:</label>
        <input id="startDate" formControlName="startDate" type="date">
      </div>
      <div>
        <label for="endDate">Data zakończenia:</label>
        <input id="endDate" formControlName="endDate" type="date">
      </div>
      <div>
        <label for="travelers">Liczba podróżujących:</label>
        <input id="travelers" formControlName="travelers" type="number">
      </div>
      <div>
        <label for="budget">Budżet:</label>
        <input id="budget" formControlName="budget" type="number">
      </div>
      <button type="submit" [disabled]="!tripForm.valid">Zapisz zmiany</button>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    label {
      font-weight: bold;
    }
    input {
      padding: 5px;
      border-radius: 3px;
      border: 1px solid #ccc;
    }
    button {
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
  `]
})
export class TripEditComponent implements OnInit {
  tripForm!: FormGroup;
  tripId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.params.subscribe(params => {
      this.tripId = params['id'];
      this.loadTripData();
    });
  }

  initForm(): void {
    this.tripForm = this.fb.group({
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      travelers: [1, [Validators.required, Validators.min(1)]],
      budget: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadTripData(): void {
    const trip = this.tripService.getTripById(this.tripId);
    if (trip) {
      this.tripForm.patchValue(trip);
    }
  }

  onSubmit(): void {
    if (this.tripForm.valid) {
      const updatedTrip: Trip = {
        id: this.tripId,
        ...this.tripForm.value
      };
      this.tripService.updateTrip(updatedTrip);
      this.router.navigate(['/trips']);
    }
  }
}