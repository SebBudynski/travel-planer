// src/app/pages/trip-details/trip-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip, DayPlan, PackingItem, ImportantInfo } from '../../models/trip.model';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="trip">
      <h2>{{ trip.destination }}</h2>
      <div class="trip-info">
        <p><strong>Początek podróży:</strong> {{ trip.origin }}</p>
        <p><strong>Data:</strong> {{ trip.startDate }} - {{ trip.endDate }}</p>
        <p><strong>Liczba podróżujących:</strong> {{ trip.travelers }}</p>
        <p><strong>Budżet:</strong> {{ trip.budget }} PLN</p>
      </div>
      
      <div class="day-plans">
        <h3>Plan podróży</h3>
        <div *ngFor="let plan of trip.dayPlans" class="day-plan">
          <h4>{{ plan.date | date:'fullDate' }}</h4>
          <ul>
            <li *ngFor="let activity of plan.activities">{{ activity }}</li>
          </ul>
        </div>
      </div>
      
      <div class="packing-list">
        <h3>Lista rzeczy do zabrania</h3>
        <ul>
          <li *ngFor="let item of trip.packingList" (click)="togglePacked(item)">
            <input type="checkbox" [checked]="item.packed" readonly>
            <span [class.packed]="item.packed">{{ item.name }}</span>
          </li>
        </ul>
      </div>
      
      <div class="important-info">
        <h3>Ważne informacje</h3>
        <ul>
          <li *ngFor="let info of trip.importantInfo">
            <strong>{{ info.category }}:</strong> {{ info.details }}
          </li>
        </ul>
      </div>
      
      <button routerLink="/trips" class="btn btn-primary">Powrót do listy</button>
    </div>
  `,
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {
  trip: Trip | undefined;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trip = this.tripService.getTripById(id);
    }
  }

  togglePacked(item: PackingItem): void {
    item.packed = !item.packed;
    if (this.trip) {
      this.tripService.updateTrip(this.trip);
    }
  }
}