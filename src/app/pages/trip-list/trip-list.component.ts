import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2>Twoje zaplanowane podróże</h2>
      <div *ngIf="trips.length === 0" class="card empty-state">
        Nie masz jeszcze żadnych zaplanowanych podróży.
      </div>
      <div *ngIf="trips.length > 0" class="grid">
        <div *ngFor="let trip of trips" class="card trip-card">
          <h3>{{ trip.destination }}</h3>
          <p><strong>Początek podróży:</strong> {{ trip.origin }}</p>
          <p><strong>Data:</strong> {{ trip.startDate }} - {{ trip.endDate }}</p>
          <p><strong>Liczba podróżujących:</strong> {{ trip.travelers }}</p>
          <p><strong>Budżet:</strong> {{ trip.budget }} PLN</p>
          <div class="button-group">
            <button (click)="editTrip(trip.id)" class="btn btn-secondary">Edytuj</button>
            <button (click)="deleteTrip(trip.id)" class="btn btn-outline">Usuń</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./trip-list.component.scss']
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.trips = this.tripService.getTrips();
  }

  editTrip(id: string): void {
    this.router.navigate(['/edit-trip', id]);
  }

  deleteTrip(id: string): void {
    if (confirm('Czy na pewno chcesz usunąć tę podróż?')) {
      this.tripService.deleteTrip(id);
      this.loadTrips();
    }
  }
}