// src/app/pages/trip-list/trip-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TripService } from '../../services/trip-service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Twoje zaplanowane podróże</h2>
    <div *ngIf="trips.length === 0">
      Nie masz jeszcze żadnych zaplanowanych podróży.
    </div>
    <ul *ngIf="trips.length > 0">
      <li *ngFor="let trip of trips">
        <h3>{{ trip.destination }}</h3>
        <p>Od: {{ trip.startDate }} Do: {{ trip.endDate }}</p>
        <p>Liczba podróżujących: {{ trip.travelers }}</p>
        <p>Budżet: {{ trip.budget }} PLN</p>
        <a [routerLink]="['/trip', trip.id]">Szczegóły</a>
      </li>
    </ul>
  `,
  styles: [`
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      border: 1px solid #ddd;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
    }
  `]
})
export class TripListComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.trips = this.tripService.getTrips();
  }
}