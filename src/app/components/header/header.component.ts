import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/plan">Plan Trip</a>
        <a routerLink="/trips">My Trips</a>
        <a routerLink="/profile">Profile</a>
      </nav>
    </header>
  `,
  styles: [
    `
      nav {
        display: flex;
        justify-content: space-around;
        padding: 1rem;
        background-color: #f8f9fa;
      }
      a {
        text-decoration: none;
        color: #007bff;
      }
    `,
  ],
})
export class HeaderComponent {}
