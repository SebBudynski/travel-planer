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
        <a routerLink="/profile">Profile</a>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent { }
