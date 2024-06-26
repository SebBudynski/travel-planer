import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'trip/:id',
    loadComponent: () =>
      import('./pages/trip-details/trip-details.component').then(
        (m) => m.TripDetailsComponent
      ),
  },
  {
    path: 'plan',
    loadComponent: () =>
      import('./pages/trip-planner/trip-planner.component').then(
        (m) => m.TripPlannerComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
  },
];
