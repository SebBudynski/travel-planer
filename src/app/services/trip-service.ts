import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly STORAGE_KEY = 'planned_trips';

  constructor() { }

  saveTrip(trip: Trip): void {
    const trips = this.getTrips();
    trip.id = this.generateId();
    trips.push(trip);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
  }

  getTrips(): Trip[] {
    const tripsJson = localStorage.getItem(this.STORAGE_KEY);
    return tripsJson ? JSON.parse(tripsJson) : [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}