import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container d-flex align-items-center justify-content-center min-vh-100">
    <div class="card p-4 shadow" style="width: 420px;">
      <h3 class="mb-3">Reset Password</h3>
      <div class="mb-3">
        <label class="form-label">New Password</label>
        <input class="form-control" type="password" [(ngModel)]="newPassword" placeholder="Enter new password" />
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" (click)="submit()">Reset</button>
        <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
      </div>
    </div>
  </div>
  `
})
export class ResetPasswordComponent {
  token = '';
  newPassword = '';

  constructor(private route: ActivatedRoute, private api: IntegrationService, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  submit() {
    if (!this.newPassword || !this.token) { alert('Missing token or password'); return; }
    this.api.resetPassword(this.token, this.newPassword).subscribe(
      () => { alert('Password reset successful. Please login.'); this.router.navigate(['/login']); },
      () => { alert('Invalid or expired token'); }
    );
  }

  cancel() { this.router.navigate(['/login']); }
}


