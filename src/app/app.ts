
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'Finance Manager';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service is automatically initialized in constructor
    // This ensures dark mode is set as default on app startup
  }
}
