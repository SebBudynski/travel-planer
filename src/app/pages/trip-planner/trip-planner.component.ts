import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule], // dodaj inne potrzebne moduły
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.scss'],
})
export class TripPlannerComponent {
  // ...
}
