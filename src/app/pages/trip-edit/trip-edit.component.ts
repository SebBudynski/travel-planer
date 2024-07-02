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
  templateUrl: './trip-edit.component.html',
  styleUrls: [`./trip-edit.component.scss`]
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