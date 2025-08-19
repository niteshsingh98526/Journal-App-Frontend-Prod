import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IntegrationService } from '../../services/integration.service';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent {

  registerAdminForm: FormGroup;
    submitted = false;
  
    constructor(private fb: FormBuilder, private authService: IntegrationService, private router: Router) {
      this.registerAdminForm = this.fb.group({
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
      return this.registerAdminForm.get(name);
    }
  
    registerAdmin() {
      this.submitted = true;
      if (this.registerAdminForm.valid) {
        this.authService.createAdminUser(this.registerAdminForm.value).subscribe(
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
