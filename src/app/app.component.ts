import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Journal-App';

  constructor(private router: Router, private authService: AuthService) {}

  isDashboard(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  ngOnInit() {
    // Check token validity on app load
    if (this.authService.isTokenExpired()) {
      this.authService.removeToken();
    } else {
      this.authService.autoLogoutOnTokenExpiration();
    }
  }
}
