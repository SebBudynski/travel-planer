import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
}).catch(err => console.error(err));

// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'trip/:id', loadComponent: () => import('./pages/trip-details/trip-details.component').then(m => m.TripDetailsComponent) },
  { path: 'plan', loadComponent: () => import('./pages/trip-planner/trip-planner.component').then(m => m.TripPlannerComponent) },
  { path: 'profile', loadComponent: () => import('./pages/user-profile/user-profile.component').then(m => m.UserProfileComponent) }
];
