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
    this.saveTrips(trips);
  }

  getTrips(): Trip[] {
    const tripsJson = localStorage.getItem(this.STORAGE_KEY);
    return tripsJson ? JSON.parse(tripsJson) : [];
  }

  getTripById(id: string): Trip | undefined {
    return this.getTrips().find(trip => trip.id === id);
  }

  updateTrip(updatedTrip: Trip): void {
    const trips = this.getTrips();
    const index = trips.findIndex(trip => trip.id === updatedTrip.id);
    if (index !== -1) {
      trips[index] = updatedTrip;
      this.saveTrips(trips);
    }
  }

  deleteTrip(id: string): void {
    const trips = this.getTrips().filter(trip => trip.id !== id);
    this.saveTrips(trips);
  }

  private saveTrips(trips: Trip[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}