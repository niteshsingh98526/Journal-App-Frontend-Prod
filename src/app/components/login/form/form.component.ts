import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntegrationService } from '../../../services/integration.service';
import { LoginRequest } from '../../../model/login-request';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  constructor(private integration: IntegrationService) {}

  // ✅ FormGroup with Validation
  userForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]), // Email validation added
    password: new FormControl('', [Validators.required, Validators.minLength(5)]) // Min length validation added
  });

  router = inject(Router);
  request: LoginRequest = new LoginRequest();
  submitted = false;
  forgotInput = '';

  getFormControl(controlName: string) {
    return this.userForm.get(controlName);
  }

  yesLogin() {
  this.submitted = true;

  if (this.userForm.invalid) {
    return;
  }

  this.request.userName = this.userForm.value.userName;
  this.request.password = this.userForm.value.password;

  this.integration.doLogin(this.request).subscribe(
    (res) => {
      console.log(res);
      if (res.token != null) {
        alert("✅ User login successful!" + res.token);
        const jwtToken=res.token;
        localStorage.setItem('jwt', jwtToken);
        // Fetch current user and store roles/info
        this.integration.getCurrentUser().subscribe(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            if (user.roles) {
              localStorage.setItem('roles', JSON.stringify(user.roles));
            }
          }
          this.router.navigateByUrl('')
        }, _ => {
          this.router.navigateByUrl('')
        });
      } else {
        alert("❌ User credentials are incorrect!");
      }
    },
    (error) => {
      alert("❌ No user credentials are inputed!");
    }
  );
}

openForgot() {
  const modalEl = document.getElementById('forgotModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

submitForgot() {
  if (!this.forgotInput) {
    alert('Please enter email or username');
    return;
  }
  this.integration.requestPasswordReset(this.forgotInput).subscribe(
    () => alert('If the account exists, a reset link has been sent.'),
    () => alert('If the account exists, a reset link has been sent.')
  );
}

navigateToRegister() {
  this.router.navigate(['/register']); // Redirects to Registration Page
}

navigateToAdminLogin() {
  this.router.navigate(['/admin']); // Redirects to Admin Page
}

}
