// src/app/services/trip.service.ts
import { Injectable } from '@angular/core';
import { Trip, DayPlan, PackingItem, ImportantInfo } from '../models/trip.model';

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

  getTripById(id: string): Trip | undefined {
    return this.getTrips().find(trip => trip.id === id);
  }

  updateTrip(updatedTrip: Trip): void {
    const trips = this.getTrips();
    const index = trips.findIndex(trip => trip.id === updatedTrip.id);
    if (index !== -1) {
      trips[index] = updatedTrip;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
    }
  }

  deleteTrip(id: string): void {
    const trips = this.getTrips().filter(trip => trip.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}