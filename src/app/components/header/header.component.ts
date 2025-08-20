import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [RouterModule, CommonModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.css'
})
export class HeaderComponent {

	route: string = ''; 
  isMenuOpen = false;

  constructor(private router: Router) {
    this.route = this.router.url;
    this.router.events.subscribe(() => {
      this.route = this.router.url; // keep route in sync so isPasswordResetPage stays accurate
      this.isMenuOpen = false; // close on navigation
    });
  }

  closeNavbar(): void {
    this.isMenuOpen = false;
  }

  toggleNavbar(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isPasswordResetPage(): boolean {
    return this.route.includes('/reset-password');
  }

	isLoggedIn(): boolean {
		return !!localStorage.getItem('jwt');
	}

	isAdmin(): boolean {
		try {
			const roles = JSON.parse(localStorage.getItem('roles') || '[]');
			return Array.isArray(roles) && roles.includes('ADMIN');
		} catch {
			return false;
		}
	}

	logout(): void {
		localStorage.removeItem('jwt');
		localStorage.removeItem('roles');
		localStorage.removeItem('currentUser');
		window.location.href = '/login';
	}
}
