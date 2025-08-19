import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IntegrationService } from '../../services/integration.service';
import { UserEntry } from '../../model/user-entry';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  users: UserEntry[] = [];
  notification: string | null = null;

  createForm!: FormGroup;
  editForm!: FormGroup;
  selectedUserId!: number | null;

  //pagination
    currentPage = 1;
    pageSize = 5;  // show 5 per page
    totalPages = 0;
    paginatedUsers: UserEntry[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: IntegrationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Create form
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      password: ['', Validators.required]
    });

    // Edit form
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      password: [''] // optional for editing
    });
  }

  // Load all users
  loadUsers(): void {
    this.adminService.getAllUsers().subscribe((data) => { this.users = data,
      this.totalPages = Math.ceil(this.users.length / this.pageSize),
      this.updatePaginatedJournals()
  });
  }

  updatePaginatedJournals(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedJournals();
  }

  // Create modal
  openCreateModal(): void {
    const modalEl = document.getElementById('createModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // Edit modal
  openEditModal(user: any): void {
    this.selectedUserId = user.id;
    this.editForm.patchValue({
      name: user.userName,
      email: user.email,
      role: user.roles?.[0] || 'User',
      password: ''
    });
    const modalEl = document.getElementById('editModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  // Create user
  onCreateSubmit(): void {
    if (this.createForm.invalid) return;
    const payload = this.createForm.value;
    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.notification = 'User created successfully!';
        this.loadUsers();
        this.closeModal('createModal');
        this.createForm.reset({ role: 'User' });
        this.autoHideNotification();
      },
      error: (err) => console.error('Error creating user', err)
    });
  }

  // Edit user
  onEditSubmit(): void {
    if (!this.selectedUserId || this.editForm.invalid) return;
    const payload = { ...this.editForm.value };
    this.adminService.updateUser(this.selectedUserId, payload).subscribe({
      next: () => {
        this.notification = 'User updated successfully!';
        this.loadUsers();
        this.closeModal('editModal');
        this.autoHideNotification();
      },
      error: (err) => console.error('Error updating user', err)
    });
  }

  // Delete user
  confirmDelete(id: number | undefined): void {
    if (!id) return;
    if (confirm('⚠️ Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe(() => {
        alert('🗑️ User deleted successfully!');
        this.loadUsers();
      });
    }
  }

  // Close modal
  closeModal(modalId: string): void {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
  }

  // Auto hide notification
  autoHideNotification(): void {
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
}