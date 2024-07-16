import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'trip/:id',
    loadComponent: () =>
      import('./pages/trip-details/trip-details.component').then(
        c => c.TripDetailsComponent
      ),
  },
  {
    path: 'plan',
    loadComponent: () =>
      import('./pages/trip-planner/trip-planner.component').then(
        c => c.TripPlannerComponent
      ),
  },
  {
    path: 'trips',
    loadComponent: () =>
      import('./pages/trip-list/trip-list.component').then(
        c => c.TripListComponent
      ),
  },
  {
    path: 'trip-edit/:id',
    loadComponent: () =>
      import('./pages/trip-edit/trip-edit.component').then(
        c => c.TripEditComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        c => c.UserProfileComponent
      ),
  },
];
