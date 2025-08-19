import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IntegrationService } from '../../services/integration.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private authService: IntegrationService, private router: Router) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      
    }, { validators: this.passwordsMatch });
  }

  // Custom validator for password match
  passwordsMatch(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  getFormControl(name: string) {
    return this.registerForm.get(name);
  }

  registerUser() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.authService.createUser(this.registerForm.value).subscribe(
        (response) => {
          console.log('Registration Successful', response);
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration Failed', error);
          alert('Registration failed. Try again.');
        }
      );
    }
  }

}
