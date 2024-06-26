// src/app/pages/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <header class="hero">
        <h1>Odkryj Świat z Travel Planner</h1>
        <p>Zaplanuj swoją wymarzoną podróż łatwo i szybko</p>
        <a routerLink="/plan" class="btn btn-primary">Zaplanuj Podróż</a>
      </header>

      <section class="features">
        <div class="feature">
          <h2>Łatwe Planowanie</h2>
          <p>Intuicyjny interfejs do planowania każdego etapu Twojej podróży</p>
        </div>
        <div class="feature">
          <h2>Mapy i Trasy</h2>
          <p>Wizualizuj swoją trasę z integracją map Google</p>
        </div>
        <div class="feature">
          <h2>Współdzielenie</h2>
          <p>Łatwo dziel się swoimi planami z przyjaciółmi i rodziną</p>
        </div>
      </section>

      <section class="popular-destinations">
        <h2>Popularne Destynacje</h2>
        <div class="destinations-grid">
          <div class="destination" *ngFor="let dest of popularDestinations">
            <img [src]="dest.image" [alt]="dest.name" />
            <h3>{{ dest.name }}</h3>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  popularDestinations = [
    { name: 'Paryż', image: 'assets/images/paris.jpg' },
    { name: 'Tokio', image: 'assets/images/tokyo.jpg' },
    { name: 'Nowy Jork', image: 'assets/images/new-york.jpg' },
    { name: 'Sydney', image: 'assets/images/sydney.avif' },
  ];
}
